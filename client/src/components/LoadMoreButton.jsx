const LoadMoreButton = ({ state, fetchFunction, deletedDocCount, manage }) => {
  // If the totalDocs is greater than the number of results, show the load more button
  if (state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        className='text-dark-grey py-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
        onClick={() => {
          // deletedDocCount for notificationPage and ManageBlogsPage
          // manage for ManageBlogsPage
          // if manage is not passed, it means it is NotificationPage
          // if manage is passed, it means it is ManageBlogsPage
          if (deletedDocCount || manage) {
            if (manage) {
              if (manage === 'published') {
                fetchFunction(parseInt(state.page) + 1, deletedDocCount, false)
              } else {
                fetchFunction(parseInt(state.page) + 1, deletedDocCount, true)
              }
            } else {
              fetchFunction(parseInt(state.page) + 1, deletedDocCount)
            }
          } else {
            // fetchFunction for other pages
            fetchFunction(parseInt(state.page) + 1)
          }
        }}
      >
        Load more
      </button>
    )
  }
}

export default LoadMoreButton
