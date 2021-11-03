import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props)
    this.updateQuote = this.updateQuote.bind(this)
    this.goBack = this.goBack.bind(this)
    this.fetchTag = this.fetchTag.bind(this)
    this.baseURL = "https://smile-plz.smileplz.repl.co/quotes?limit=100"
    this.state = {
      quotes : [],
      index : -1,
      status: "initial",
      text : "",
      author : "",
      tags: [],
      current: "",
      links :  {twitter: ""}
    }
    this.colors = [
      "49,107,131",
      "109,130,153",
      "19,44,51",
      "79,206,132",
      "57,125,228",
      "224,111,66",
      "38,70,83",
      "42,157,143",
      "233,196,106",
      "244,162,97",
      "231,111,81"
  ]
  }
 
  async fetchQuotes(params=""){
    const res = await fetch(this.baseURL+params)      
    return res.json()
  }

  fetchTag(event){
    if (event.target.classList.contains("dismiss")){
      this.setState({
        status: "fetching",
        quotes: [],
        index: -1
      })
      this.fetchQuotes()
      .then(json => {
         this.setState({
            quotes : json.quotes,
            status : "fetched",
            current: ""
         })
        this.updateQuote()
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          status: "error"
        })
      })
      return
    }
    const tag = event.target.innerText.replaceAll("_","-")
    this.setState({
      status: "fetching",
      quotes: [],
      index: -1
    })
    this.fetchQuotes("&tags="+tag)
      .then(json => {
         this.setState({
            quotes : json.quotes,
            status : "fetched",
            current: tag
         })
        this.updateQuote()
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          status: "error"
        })
      })
  }
  componentDidMount(){
    this.fetchQuotes()
      .then(json => {
         this.setState({
            quotes : json.quotes,
            status : "fetched"
         })
        this.updateQuote()
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          status: "error"
        })
      })
  }
  formatTags(tags){
    let fmtedTags = []
    for(let tag of tags.split(",")){
      tag = tag.trim().replaceAll(" ","_").replaceAll("-","_")
      if(tag.length<20 && tag.length>2)
        fmtedTags.push(tag)
      if(fmtedTags.length>3)
        break;
    }
    return fmtedTags;
  }  
  updateQuote(){
    document.documentElement.style.setProperty("--accent",this.colors[Math.floor(Math.random()*this.colors.length)])
    if (this.state.index===this.state.quotes.length-10){
      this.setState({
        status: "fetching"
      })
     this.fetchQuotes(this.state.current===""? "" : "&tags="+this.state.current)
       .then(json => {
          this.setState(state => ({
            quotes : state.quotes.concat(json.quotes),
            status : "fetched"
          })
       )
     })
  }
  let newIndex = this.state.index + 1
  if (newIndex===this.state.quotes.length){
    newIndex = 0
    this.setState({
      current: this.state.current+" (repeating)"
    })
  }
  this.setState(state => ({
     text: state.quotes[newIndex].quote,
     author: "- "+state.quotes[newIndex].author,
     tags: this.formatTags(state.quotes[newIndex].tags),
     links : {
       twitter: `https://twitter.com/intent/tweet?hashtags=quotes,${this.formatTags(state.quotes[newIndex].tags).join(",")}&text=${encodeURIComponent(state.quotes[newIndex].quote+"\n-"+state.quotes[newIndex].author+"\n")}`
     },
     index: newIndex
    }) 
   )
  }
  goBack(){
    document.documentElement.style.setProperty("--accent",this.colors[Math.floor(Math.random()*this.colors.length)])
    const newIndex = this.state.index - 1
    this.setState(state => ({
      text: state.quotes[newIndex].quote,
      author: "- "+state.quotes[newIndex].author,
      tags: this.formatTags(state.quotes[newIndex].tags),
      links : {
        twitter: `https://twitter.com/intent/tweet?hashtags=${this.formatTags(state.quotes[newIndex].tags).join(",")}&text=${encodeURIComponent(state.quotes[newIndex].quote+"\n-"+state.quotes[newIndex].author+"\n")}`
      },
      index: newIndex
     }) 
    )
  }
  render() {
    return( 
       <div className="card" id="quote-box">
         {this.state.current!=="" && <h2 className="current card-title">#{this.state.current} Quotes</h2>}
         <div id="text-cont">
         <svg viewBox="0 0 512 512" width="30" title="quote-left" className="quote-icon">
           <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
         </svg>
         <p id="text">{this.state.text}</p>
       </div>
         <div id="author">{this.state.author}</div>
         {/* {this.state.text!=="" && <div id="tags">{" #"+this.state.tags.join(" #")}</div> } */}
         {this.state.text!=="" && <Tags tags={this.state.tags} current={this.state.current} callback={this.fetchTag} /> }
         <div className="bottom-bar">
           {this.state.text!=="" && <Social links= {this.state.links}/>}
           <div className="navigation">
             {this.state.index>0 && <button className="btn btn-primary nav-button" id="go-back" onClick={this.goBack}>Go Back</button> }
             {(this.state.status!=="fetched" && (this.state.index===this.state.quotes.length || this.state.quotes.length===0)) ? 
              <button className="btn btn-primary nav-button disabled" id="new-quote">Fetching Quotes</button>  :
              <button className="btn btn-primary nav-button" id="new-quote" onClick={this.updateQuote}>New Quote</button> }
           </div>
         </div>
       </div>
    )
  }
}
const Tags = (props) => {
  const quoteTags = props.tags.filter(v => v!==props.current.replaceAll("-","_"))
  return (
    <div className="tags-cont row">
      {props.current!=="" && <button className="tag btn col dismiss" onClick={props.callback}>{props.current}<span className="dismiss dismiss-icon" aria-hidden="true">&times;</span></button>}
      {quoteTags.map((tag,key) => {  
        return (<button key={key} className="tag btn col" onClick={props.callback}>{tag}</button>)
        })}
    </div>
  )
}
const Social = (props) => {
  return (
    <div className="social-buttons">
      <a 
        className = "btn btn-secondary"
        href = {props.links.twitter}
        id="tweet-quote"
        target="_blank"
        rel="noreferrer">Tweet</a>
    </div>
  )
}

export default App;