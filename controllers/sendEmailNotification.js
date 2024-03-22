import notificationapi from 'notificationapi-node-server-sdk'

const sendEmailNotification = ({
  notificationId, users = [], mergeTags
}) => {
  notificationapi.init(
    process.env.NOTIFICATIONAPI_ID,
    process.env.NOTIFICATIONAPI_SECRET
  )
  users.forEach(user => {
    notificationapi.send({
      notificationId,
      user,
      mergeTags
    })
  })
}

export default sendEmailNotification;