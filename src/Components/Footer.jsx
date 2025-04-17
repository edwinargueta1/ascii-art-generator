import FooterButton from "./FooterButton";

export default function Footer(props){
    return(
        <footer>
            <FooterButton label={"Info"} windowToggle={props.windowToggle}/>
            <FooterButton label={"Github"} link={"https://github.com/edwinargueta1/ascii-art-generator"}/>
            <FooterButton label={"Better-Type"} link={"https://better-type.web.app/"}/>
        </footer>
    )
}