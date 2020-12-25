using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuoteService.Controllers
{
    [ApiController]
    [Route("api/error")]
    public class ErrorController : ControllerBase
    {
        //[Route("/api/error")]
        //[HttpDelete("api/error")]
        //[HttpGet("api/error")]
        //[HttpPost("api/error")]
        //[HttpPut("api/error")]
        [HttpDelete]
        [HttpGet]
        [HttpPost]
        [HttpPut]
        public IActionResult Error()
        {
            var problem = Problem();
            // FIXME: not hitting this breakpoint from the UI
            // when calling a non-existent controller.
            // OK when calling a real controller with a non-existent ID
            return problem;
        }
    }
}
