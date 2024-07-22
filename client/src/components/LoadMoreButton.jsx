const LoadMoreButton = ({ state, fetchFunction, deletedDocCount }) => {
  if (state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        className='text-dark-grey py-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
        onClick={() => {
          if (deletedDocCount) {
            fetchFunction(parseInt(state.page) + 1, deletedDocCount)
          } else {
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
