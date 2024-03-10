using TravelFactory.Services;


var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", policy =>
        policy.WithOrigins("http://localhost:3000") // Adjust the port if necessary
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()); // Include this if your requests involve credentials
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSingleton<ITranslationService, TranslationService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();





var app = builder.Build();

// Use CORS
app.UseCors("MyCorsPolicy");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
