import Icon from 'react-icons-kit'
import {github} from 'react-icons-kit/icomoon/github'
import {linkedin} from 'react-icons-kit/icomoon/linkedin'


const Footer = () => {

  const handleNavigate = (e: React.MouseEvent, link: string) => {
    e.preventDefault();

    window.open(link, '_blank');
  }

  return (
    <footer className="flex items-center justify-between mt-20 border-t-2 border-cyan-600 text-cyan-600 p-10">
        <h2 className='cursor-default'>By Luis Alberto Martinez</h2>
        <div className='flex gap-8 px-4'>
          <span className='flex items-center justify-center cursor-pointer hover:text-gray-300 ease-in-out transition-colors duration-200 delay-100' title='Go github' onClick={e => handleNavigate(e, 'https://github.com/LuisMartinezM98')}>
            <Icon icon={github} size={25}/>
          </span>
          <span className='flex items-center justify-center cursor-pointer hover:text-gray-300 ease-in-out transition-colors duration-200 delay-100' title='Go linkedin' onClick={e => handleNavigate(e, 'https://www.linkedin.com/in/lmartinezm0298/')}>
            <Icon icon={linkedin} size={25}/>
          </span>
        </div>
    </footer>
  )
}

export default Footer