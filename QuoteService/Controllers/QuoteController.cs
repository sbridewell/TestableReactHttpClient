using Microsoft.AspNetCore.Mvc;
using QuoteService.ViewModels;
using System;
using System.Collections.Generic;

namespace QuoteService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private static Dictionary<int, string> _quotes = new Dictionary<int, string>();

        static QuoteController()
        {
            _quotes.Add(1, "There's no point prevaricating around the bush");
            _quotes.Add(2, "Cracking cheese, Gromit");
            _quotes.Add(3, "Not even Wensleydale?");
            _quotes.Add(4, "It's the wrong trousers, Gromit");
        }

        /// <summary>
        /// Gets a quote.
        /// </summary>
        /// <param name="id">The quote ID (optional).</param>
        /// <param name="searchString">The search string (optional).</param>
        /// <returns>
        /// If no parameters are supplied, a message indicating this.
        /// If an ID is supplied, the quote with that ID, otherwise a 404 error.
        /// If a search string is supplied, the first quote containing that string, otherwise 
        /// a message indicating that no matching quote exists.
        /// If an ID and a search string are both supplied, returns the quote with that ID, but
        /// only if it contains the search string, otherwise a message indicating that the quote
        /// doesn't contain the search string.
        /// </returns>
        [HttpGet]
        public ActionResult<ReadQuoteVM> Get(int? id, string searchString)
        {
            if (id is null)
            {
                if (string.IsNullOrWhiteSpace(searchString))
                {
                    return GetNoParameters();
                }
                else
                {
                    return GetBySearchString(searchString);
                }
            }
            else
            {
                // We've got an ID so cast it to non-nullable int
                var intId = (int)id;
                if (string.IsNullOrWhiteSpace(searchString))
                {
                    return GetById(intId);
                }
                else
                {
                    return GetByIdAndSearchString(intId, searchString);
                }
            }
        }

        /// <summary>
        /// Creates a new quote if there isn't already one with the supplied ID.
        /// Replaces a quote if there is already one with the supplied ID.
        /// </summary>
        /// <param name="id">The quote ID.</param>
        /// <param name="quote">The quote.</param>
        /// <returns>The created quote.</returns>
        [HttpPut]
        public ActionResult<ReadQuoteVM> Put(int id, [FromBody]WriteQuoteVM viewModel)
        {
            if (_quotes.ContainsKey(id))
            {
                _quotes[id] = viewModel.Quote;
            }
            else
            {
                _quotes.Add(id, viewModel.Quote);
            }

            return new ReadQuoteVM(id, viewModel.Quote);
        }

        /// <summary>
        /// Creates a new quote and returns its ID.
        /// </summary>
        /// <param name="viewModel">View model containing the quote to create.</param>
        /// <returns>The created quote.</returns>
        [HttpPost]
        public ActionResult<ReadQuoteVM> Post([FromBody]WriteQuoteVM viewModel)
        {
            var candidateKey = 1;
            while (_quotes.ContainsKey(candidateKey))
            {
                candidateKey++;
            }

            _quotes.Add(candidateKey, viewModel.Quote);
            return new ReadQuoteVM(candidateKey, viewModel.Quote);
        }

        /// <summary>
        /// Deletes the quote with the supplied ID if it exists.
        /// </summary>
        /// <param name="id">ID of the quote to delete.</param>
        /// <returns>
        /// If the quote existed, returns the deleted quote.
        /// If the quote didn't exist, returns a 404 error.
        /// </returns>
        [HttpDelete]
        public ActionResult<ReadQuoteVM> Delete(int id)
        {
            if (_quotes.ContainsKey(id))
            {
                var quote = new ReadQuoteVM(id, _quotes[id]);
                _quotes.Remove(id);
                return quote;
            }
            else
            {
                return NotFound();
            }
        }

        /// <summary>
        /// No parameters were supplied to the Get method.
        /// </summary>
        /// <returns>A message saying no parameters were supplied.</returns>
        private ActionResult<ReadQuoteVM> GetNoParameters()
        {
            // Delay so that we can see the UI's "Loading..." message
            System.Threading.Thread.Sleep(1000);
            return BadRequest();
        }

        /// <summary>
        /// A search string was supplied to the Get method.
        /// No ID was supplied.
        /// </summary>
        /// <param name="searchString">The supplied search string.</param>
        /// <returns>The first quote which contains the supplied search string.</returns>
        private ActionResult<ReadQuoteVM> GetBySearchString(string searchString)
        {
            foreach (var key in _quotes.Keys)
            {
                if (_quotes[key].Contains(searchString, StringComparison.InvariantCultureIgnoreCase))
                {
                    return new ReadQuoteVM(key, _quotes[key]);
                }
            }

            return NotFound();
        }

        /// <summary>
        /// We have an ID and no search string.
        /// </summary>
        /// <param name="id">The supplied ID.</param>
        /// <returns>The quote with the supplied ID.</returns>
        private ActionResult<ReadQuoteVM> GetById(int id)
        {
            if (_quotes.ContainsKey(id))
            {
                return new ReadQuoteVM(id, _quotes[id]);
            }
            else
            {
                // Invalid ID - return a 404 rather than a 500
                return NotFound();
            }
        }

        /// <summary>
        /// We have both an ID and a search string.
        /// </summary>
        /// <param name="id">The supplied ID.</param>
        /// <param name="searchString">The supplied search string.</param>
        /// <returns>
        /// The quote with the supplied ID, but only if it contains the supplied search string.
        /// </returns>
        private ActionResult<ReadQuoteVM> GetByIdAndSearchString(int id, string searchString)
        {
            if (!_quotes.ContainsKey(id))
            {
                return NotFound();
            }

            var quote = _quotes[id];
            if (quote.Contains(searchString, StringComparison.InvariantCultureIgnoreCase))
            {
                return new ReadQuoteVM(id, quote);
            }
            else
            {
                return NotFound();
            }
        }
    }
}