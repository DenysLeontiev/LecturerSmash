import { Component, ElementRef, ViewChild, signal, computed, OnInit, DestroyRef, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '../../services/api.service';
import { Worker } from '../../models/worker.model';
import { Department } from '../../models/department.model';
import { Institute } from '../../models/institute.model';

@Component({
  selector: 'app-swipe-comparison',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './swipe-comparison.component.html',
  styleUrl: './swipe-comparison.component.scss'
})
export class SwipeComparisonComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  private destroyRef = inject(DestroyRef);
  private apiService = inject(ApiService);

  // Input for department ID
  departmentId = input.required<string>();

  // Department and Institute information
  public departmentInfo = signal<Department | null>(null);
  public instituteInfo = signal<Institute | null>(null);

  // Current worker pair for comparison
  public currentPair = signal<Worker[]>([]);
  public swipeDirection = signal<'left' | 'right' | null>(null);
  public error = signal<string>('');
  public isLoading = signal(false);
  public comparisonCount = signal(0);

  private currentWinner = signal<Worker | null>(null);
  private winnerPosition = signal<'left' | 'right' | null>(null);
  private swipeOffset = signal(0);
  private isAnimating = signal(false);

  public canSwipe = computed(() => !this.isAnimating() && !this.isLoading());

  // Swipe direction toggle: true = normal (swipe right selects right), false = inverted (swipe right selects left)
  private normalSwipeDirection = signal(false);

  // Touch/mouse tracking
  private startX = 0;
  private isDragging = false;
  private animationFrameId: number | null = null;

  // Computed properties

  // Expose Math for template use
  protected readonly Math = Math;

  // Transform styles for smooth animation
  public leftCardTransform = computed(() => {
    const offset = this.swipeOffset();
    return `translateX(${offset}px)`;
  });

  public rightCardTransform = computed(() => {
    const offset = this.swipeOffset();
    return `translateX(${offset}px)`;
  });

  ngOnInit() {
    this.loadNextPair();
    this.setupGestureHandling();
  }

  private loadNextPair() {
    this.isLoading.set(true);
    this.error.set('');

    this.apiService.getTwoRandomWorkers(this.departmentId()).subscribe({
      next: (workers) => {
        if (workers.length === 2) {
          // If we have a winner from previous round, keep them and replace the other
          const winner = this.currentWinner();
          const position = this.winnerPosition();

          if (winner && position) {
            // Keep the winner and add one new worker
            const newWorker = workers.find(w => w.id !== winner.id) || workers[0];

            if (position === 'right') {
              // Winner was on right, keep them on right, new worker on left
              this.currentPair.set([newWorker, winner]);
            } else {
              // Winner was on left, keep them on left, new worker on right
              this.currentPair.set([winner, newWorker]);
            }
            this.currentWinner.set(null); // Reset winner
            this.winnerPosition.set(null); // Reset position
          } else {
            // First comparison, set both workers
            this.currentPair.set(workers);
          }
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load workers. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading workers:', error);
      }
    });
  }

  private setupGestureHandling() {
    const element = this.container.nativeElement;

    // Mouse events
    const mouseDown$ = fromEvent<MouseEvent>(element, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    // Touch events
    const touchStart$ = fromEvent<TouchEvent>(element, 'touchstart', { passive: false });
    const touchMove$ = fromEvent<TouchEvent>(document, 'touchmove', { passive: false });
    const touchEnd$ = fromEvent<TouchEvent>(document, 'touchend');

    // Handle start events
    merge(mouseDown$, touchStart$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (!this.canSwipe()) return;

        event.preventDefault();
        this.startGesture(event);
      });

    // Handle move events
    merge(mouseMove$, touchMove$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (!this.isDragging || !this.canSwipe()) return;

        event.preventDefault();
        this.updateGesture(event);
      });

    // Handle end events
    merge(mouseUp$, touchEnd$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (!this.isDragging) return;

        this.endGesture();
      });
  }

  private startGesture(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.getClientX(event);
    this.swipeDirection.set(null);
  }

  private updateGesture(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const currentX = this.getClientX(event);
    const deltaX = currentX - this.startX;

    // Limit the swipe distance
    const maxSwipe = 150;
    const clampedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));

    this.swipeOffset.set(clampedDelta);

    // Determine swipe direction for visual feedback
    if (Math.abs(deltaX) > 20) {
      this.swipeDirection.set(deltaX > 0 ? 'right' : 'left');
    }
  }

  private endGesture() {
    this.isDragging = false;
    const offset = this.swipeOffset();
    const threshold = 50;

    if (Math.abs(offset) > threshold) {
      // Trigger selection
      const direction = offset > 0 ? 'right' : 'left';
      this.makeSelection(direction);
    } else {
      // Snap back
      this.resetPosition();
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  }

  makeSelection(direction: 'left' | 'right') {
    if (!this.canSwipe()) return;

    this.isAnimating.set(true);
    const pair = this.currentPair();

    if (pair.length === 2) {
      // Apply swipe direction interpretation based on toggle
      const actualDirection = this.normalSwipeDirection() ? direction : (direction === 'left' ? 'right' : 'left');

      const winner = actualDirection === 'right' ? pair[1] : pair[0];
      const loser = actualDirection === 'right' ? pair[0] : pair[1];

      console.log(`Swipe: ${direction}, Interpreted as: ${actualDirection}, Selected: ${winner.fullName}, Rejected: ${loser.fullName}`);

      // Set the winner to be kept for next round and remember their position
      this.currentWinner.set(winner);
      this.winnerPosition.set(actualDirection === 'right' ? 'right' : 'left');

      // Record the choice (optional - implement this endpoint in your backend)
      this.apiService.likeWorker(winner.id).subscribe({
        next: (likedWorker) => {
          winner.numberOfLikes = likedWorker.numberOfLikes;
          console.log('Choice recorded: ', likedWorker);
        },
        error: (error) => console.log('Failed to record choice:', error)
      });

      this.apiService.dislikeWorker(loser.id).subscribe({
        next: (dislikedWorker) => {
          loser.numberOfDislikes = dislikedWorker.numberOfDislikes;
          console.log('Choice recorded: ', dislikedWorker);
        },
        error: (error) => console.log('Failed to record choice:', error)
      });

      // Update comparison count
      this.comparisonCount.update(count => count + 1);
    }

    // Animate out
    const finalOffset = direction === 'right' ? 300 : -300;
    this.swipeOffset.set(finalOffset);

    setTimeout(() => {
      this.nextPair();
    }, 300);
  }

  private nextPair() {
    this.swipeOffset.set(0);
    this.swipeDirection.set(null);
    this.isAnimating.set(false);

    // Load next pair (endless swiping)
    this.loadNextPair();
  }

  private resetPosition() {
    this.swipeOffset.set(0);
    this.swipeDirection.set(null);
  }

  // Manual selection methods for buttons
  selectLeft() {
    this.makeSelection('right');
  }

  selectRight() {
    this.makeSelection('left');
  }

  // Toggle swipe direction interpretation
  toggleSwipeDirection() {
    this.normalSwipeDirection.update(current => !current);
    console.log(`Swipe direction is now: ${this.normalSwipeDirection() ? 'Normal' : 'Inverted'}`);
  }

  public restart(): void {
    this.swipeOffset.set(0);
    this.swipeDirection.set(null);
    this.isAnimating.set(false);
    this.currentWinner.set(null);
    this.winnerPosition.set(null);
    this.comparisonCount.set(0);
    this.loadNextPair();
  }
}