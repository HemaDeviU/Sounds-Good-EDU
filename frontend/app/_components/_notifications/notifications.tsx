import { Notification } from '@/app/_context/data';

const NotificationBox = ({ notifications, onClose, setRemix }: {notifications: Notification[], onClose: any, setRemix: any}) => {
    return (
        <div className="absolute top-12 right-48 w-80 bg-white shadow-lg rounded-xl p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button onClick={onClose} className="text-red-500 font-semibold">X</button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2">
                <span className="text-sm">Remix permission has been granted</span>
                <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded" onClick={() => {
                  console.log(notification.ipId)
                  setRemix(notification.ipId)
                  onClose()
                }}>Remix</button>
              </div>
            ))}
          </div>
        </div>
      );
};

export default NotificationBox;
