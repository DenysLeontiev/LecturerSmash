namespace TeachersRating.API.Interfaces;

public interface IContinuousWorkIteration
{
    Task Run(CancellationToken stoppingToken);
    abstract static Task OnException(Exception ex, ILogger logger);
}