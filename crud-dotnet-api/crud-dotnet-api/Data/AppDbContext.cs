using Microsoft.EntityFrameworkCore;

namespace crud_dotnet_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        // Initializing table
        public DbSet<Employee> Employees { get; set; }
    }
}
