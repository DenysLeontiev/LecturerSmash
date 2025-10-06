import { Component, ElementRef, ViewChild, signal, computed, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';

interface ComparisonItem {
  id: string;
  imageUrl: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-swipe-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipe-comparison.component.html',
  styleUrl: './swipe-comparison.component.scss'
})
export class SwipeComparisonComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  
  private destroyRef = inject(DestroyRef);
  
  // Demo data - replace with your actual data
  protected demoItems: ComparisonItem[] = [
    {
      id: '1',
      imageUrl: 'https://via.placeholder.com/400x600/3498db/ffffff?text=Teacher+A',
      name: 'Dr. Smith',
      description: 'Computer Science Professor'
    },
    {
      id: '2',
      imageUrl: 'https://via.placeholder.com/400x600/e74c3c/ffffff?text=Teacher+B',
      name: 'Prof. Johnson',
      description: 'Mathematics Professor'
    },
    {
      id: '3',
      imageUrl: 'https://via.placeholder.com/400x600/2ecc71/ffffff?text=Teacher+C',
      name: 'Dr. Brown',
      description: 'Physics Professor'
    },
    {
      id: '4',
      imageUrl: 'https://via.placeholder.com/400x600/f39c12/ffffff?text=Teacher+D',
      name: 'Prof. Davis',
      description: 'Chemistry Professor'
    }
  ];

  currentPair = signal<ComparisonItem[]>([]);
  currentIndex = signal(0);
  swipeOffset = signal(0);
  isAnimating = signal(false);
  swipeDirection = signal<'left' | 'right' | null>(null);

  // Touch/mouse tracking
  private startX = 0;
  private isDragging = false;
  private animationFrameId: number | null = null;

  // Computed properties
  canSwipe = computed(() => !this.isAnimating());
  hasMorePairs = computed(() => this.currentIndex() < this.demoItems.length - 1);
  
  // Expose Math for template use
  protected readonly Math = Math;
  
  // Transform styles for smooth animation
  leftCardTransform = computed(() => {
    const offset = this.swipeOffset();
    return `translateX(${offset}px)`;
  });

  rightCardTransform = computed(() => {
    const offset = this.swipeOffset();
    return `translateX(${offset}px)`;
  });

  ngOnInit() {
    this.loadNextPair();
    this.setupGestureHandling();
  }

  private loadNextPair() {
    const index = this.currentIndex();
    if (index < this.demoItems.length - 1) {
      this.currentPair.set([
        this.demoItems[index],
        this.demoItems[index + 1]
      ]);
    }
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
      const winner = direction === 'right' ? pair[1] : pair[0];
      const loser = direction === 'right' ? pair[0] : pair[1];
      
      console.log(`Selected: ${winner.name}, Rejected: ${loser.name}`);
      
      // Here you would typically make an API call to record the choice
      // this.recordChoice(winner.id, loser.id);
    }

    // Animate out
    const finalOffset = direction === 'right' ? 300 : -300;
    this.swipeOffset.set(finalOffset);

    setTimeout(() => {
      this.nextPair();
    }, 300);
  }

  private nextPair() {
    this.currentIndex.update(i => i + 2);
    this.swipeOffset.set(0);
    this.swipeDirection.set(null);
    this.isAnimating.set(false);
    
    if (this.hasMorePairs()) {
      this.loadNextPair();
    } else {
      // All comparisons done
      console.log('All comparisons completed!');
      this.currentPair.set([]);
    }
  }

  private resetPosition() {
    this.swipeOffset.set(0);
    this.swipeDirection.set(null);
  }

  // Manual selection methods for buttons
  selectLeft() {
    this.makeSelection('left');
  }

  selectRight() {
    this.makeSelection('right');
  }

  restart() {
    this.currentIndex.set(0);
    this.swipeOffset.set(0);
    this.swipeDirection.set(null);
    this.isAnimating.set(false);
    this.loadNextPair();
  }
}