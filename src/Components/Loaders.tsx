
export const ListLoader = () => {
  return (
      <div className='w-full flex flex-wrap gap-10 justify-center'>
        {[1,2,3,4,5,6,7,8,9,10].map((item) => <SingleListLoader key={item} />)}
      </div>
  )
};

export const SingleListLoader = () => {
  return (
    <div className='relative bg-gray-200 shadow rounded-md max-w-sm w-full'>
      <div className="animate-pulse flex flex-col">
        <div className="h-14 bg-gray-300 rounded-t-md"></div>
        <div className="flex-1 space-y-3 p-10"></div>          
      </div>
      <div className="absolute rounded-full animate-pulse -bottom-4 -left-4 bg-gray-300 h-10 w-10"></div>
    </div>
  )
};
