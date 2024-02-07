import './CardStartpage.css';

const CardStartpage = ({text, inputBool, quizcard, quizname}) => {

  const quizCardStyle = {
    backgroundColor: '#9AC2FF'
  }
 
  return (
    <div className='cardStartpageWrapper' style={quizcard ? quizCardStyle : {}}>
        
        <p>{quizcard ? quizname : text}</p>

        {inputBool &&
        <input
        className='inputPin'
        type='text'
        placeholder='Game PIN'
        // onChange={handleChange}
        // value={searchInput}
      />
        }
        
       
    </div>
  );
};

export default CardStartpage;
