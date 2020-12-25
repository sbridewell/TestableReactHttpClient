using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuoteService.ViewModels
{
    /// <summary>
    /// View model for writing (creating / updating) quotes.
    /// </summary>
    public class WriteQuoteVM
    {
        // TODO: remove
        ///// <summary>
        ///// Parameterless constructor to allow deserialisation.
        ///// </summary>
        //private WriteQuoteVM()
        //{
        //}

        ///// <summary>
        ///// Initializes a new instance of the <see cref="WriteQuoteVM"/> class.
        ///// </summary>
        ///// <param name="quote">The quote.</param>
        //public WriteQuoteVM(string quote)
        //{
        //    Quote = quote;
        //}

        /// <summary>
        /// Gets the quote.
        /// </summary>
        public string Quote { get; set;  }
    }
}
