export function Menu() {
  return (
    <div className="absolute top-0 left-0 bg-white grid grid-cols-1 gap-4" style={{zIndex: 10000}}>
      <div className="space-x-2 py-2 m-4 inline-block text-lg px-2 text-gray-800">
        <span className="font-bold">Visualiser</span>
      </div>
      <div style={{padding: "0 30px"}}><a href="/social-media/system" className="font-light capitalize">View system</a></div>
      <div style={{padding: "0 30px"}}><a href="/social-media/application/frontend" className="font-light capitalize">View frontend application</a></div>
      <div style={{padding: "0 30px"}}><a href="/social-media/application/backend" className="font-light capitalize">View backend application</a></div>
      <div style={{padding: "0 30px"}}><a href="/social-media/application/comments_service" className="font-light capitalize">View comments application</a></div>
      <div style={{padding: "0 30px"}}><a href="/social-media/application/notification_service" className="font-light capitalize">View notification application</a></div>
      <div style={{padding: "0 30px"}}><a href="/social-media/application/public_api" className="font-light capitalize">View public application</a></div>
    </div>
  );
}