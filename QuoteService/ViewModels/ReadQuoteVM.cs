namespace QuoteService.ViewModels
{
    /// <summary>
    /// View model for reading quotes.
    /// </summary>
    public class ReadQuoteVM
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ReadQuoteVM"/> class.
        /// </summary>
        /// <param name="quoteId">The quote ID.</param>
        /// <param name="quote">The quote.</param>
        public ReadQuoteVM(int quoteId, string quote)
        {
            QuoteId = quoteId;
            Quote = quote;
        }

        /// <summary>
        /// Gets the quote ID.
        /// </summary>
        public int QuoteId { get; }

        /// <summary>
        /// Gets the quote.
        /// </summary>
        public string Quote { get; }
    }
}
