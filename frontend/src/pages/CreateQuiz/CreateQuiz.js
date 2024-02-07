import background from '../../images/blob-scene-haikei-2.svg'



function CreateQuizPage() {

    const quiz = {
        title: '',
        
        
    }

    const svgStyle = {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      };
  
  return (
        <div className='createQuizPage' style={svgStyle}>


          


        </div>
  );
}

export default CreateQuizPage;
