export default function FileDropLoader(props){

    function load(e) {
      e.preventDefault();
      
      //load the target file
      const file = e.dataTransfer.files[0];
      props.setFile(file);
    }

    function browse(e){
        document.getElementById("fileInput").click();
    }

    return(
        <div className="fileDropper" 
            onClick={browse} 
            onDragOver={(e) => e.preventDefault()}
            onDrop={load}
        >
            <p>Drop file here or click to browse.</p>
        </div>
    )
}