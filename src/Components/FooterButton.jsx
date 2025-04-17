export default function FooterButton(props) {

    function handleClick(){
        if(props.link){
            window.open(props.link, "_blank", "noopener,noreferrer");
        }
        if(props.windowToggle){
            openInfoWindow();
        }
    }
    function openInfoWindow(){
        props.windowToggle(false);
    }

  return (
    <div className="footerButton" onClick={handleClick}>
        <p>{props.label}</p>
    </div>
  );
}
