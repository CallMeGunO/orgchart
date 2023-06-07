import React from 'react'
import PropTypes from 'prop-types'

const UserInfo = ({ data, userPhotoUrl }) => {
    return (
        <div className='user-data'>
            {data.hideFromPhoneBook ? (
                <div className='user-photo'>
                    <img src={userPhotoUrl} />
                </div>
            ) : (
                <a
                    href='#'
                    onClick={() => {
                        window.open(`${process.env.SITE_URL}/SitePages/My-Profile.aspx?userId=${data.idSp}`, '_blank')
                        return false
                    }}
                >
                    <div className='user-photo'>
                        <img src={userPhotoUrl} />
                    </div>
                </a>
            )}

            <div>
                <div className='user-name'>{data.fullName}</div>
                <div className='user-position'>{data.position}</div>
                {data?.children?.length > 0 && <div className='user-department'>{data.department}</div>}
                {data?.branch && (
                    <div className='department-city-color-line' style={{ borderTop: `3px solid ${data?.branch?.color}` }} />
                )}
            </div>
        </div>
    )
}

UserInfo.propTypes = {
    data: PropTypes.object,
    userPhotoUrl: PropTypes.string
}

export default React.memo(UserInfo)
