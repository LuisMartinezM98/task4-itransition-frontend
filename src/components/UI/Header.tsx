
const Header = () => {

  const handleLogOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <header className='text-cyan-600 p-4 flex justify-around items-center'>
        <h1 className="text-2xl font-semibold">Task 4</h1>
        <p className="cursor-pointer hover:text-gray-400 transition-colors ease-in-out delay-100 duration-200 underline underline-offset-2" onClick={handleLogOut}>Log out</p>
    </header>
  )
}

export default Header