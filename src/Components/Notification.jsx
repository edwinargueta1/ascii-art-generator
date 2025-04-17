import { useEffect, useState } from "react";

export default function Notification({ title, description, type = "info", isVisible,  setNotification}) {

    function alert(){
        setNotification((prev)=> {
            return {...prev, isVisible:false}
        })
    }

  useEffect(() => {
    let timer;
    if(isVisible){
        //We set the timer to the hide the notification
        timer = setTimeout(alert, 2250);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div className={`notification ${isVisible ? type : ""}`}>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
