using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace QuoteService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            // Stuff for Swagger to expose API documentation...
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "QuoteService", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.EnvironmentName == "Development")
            {
                // TODO: remove app.UseDeveloperExceptionPage();
                app.UseExceptionHandler("/api/error");
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    // Not swagger/v1/swagger.json as per the documentation
                    // https://stackoverflow.com/a/48450346 comment from user 2b77bee6-5445-4c77-b1eb-4df3e5
                    c.SwaggerEndpoint("v1/swagger.json", "QuoteService v1");
                });
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            // UseCors must be called before UseMvc
            app.UseCors(options => options
                .WithOrigins(
                    "http://localhost:3000",
                    "https://localhost:44336")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            // TODO: remove app.UseMvc();
            // replacement for app.UseMvc() in .net core 3.1
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
