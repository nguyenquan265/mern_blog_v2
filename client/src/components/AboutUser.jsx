import { Link } from 'react-router-dom'
import getDate from '../utils/date'

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={'md:w-[90%] md:mt-7 ' + className}>
      <p className='text-xl leading-7'>
        bio: {bio.length ? bio : 'Nothing to read'}
      </p>
      <div className='flex gap-x-7 gap-y-2 flex-wrap my-3 items-center text-dark-grey'>
        {Object.keys(social_links).map((key, index) => {
          const link = social_links[key]

          return (
            link && (
              <Link to={link} key={index} target='_blank'>
                <i
                  className={
                    'text-2xl hover:text-black fi ' +
                    (ley !== 'website' ? `fi-brands-${key}` : 'fi-rr-globe')
                  }
                ></i>
                {key}
              </Link>
            )
          )
        })}
      </div>
      <p className='text-xl leading-7 text-dark-grey'>
        Joined on {getDate(joinedAt)}
      </p>
    </div>
  )
}

export default AboutUser
