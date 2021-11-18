import './App.css';
import defMark from './defaultMarkdown'
import { marked } from 'marked';
import DOMPurify  from 'dompurify'
import * as React from 'react';

export default class App extends React.Component{
  constructor(props){
    super(props);
    marked.setOptions({
      gfm: true,
      breaks: true
    })
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      preview: marked.parse(defMark),
      mark: defMark
    }
  }
  handleChange(evt){
    this.setState({
      mark: evt.target.value,
      preview: marked.parse(evt.target.value)
    })
  }
  render(){
    return(
      <div className="app">
          <h1>React Markdown Previewer</h1>
          <div className="main">
            <div className="cont">
              <h2>Enter markdown here</h2>
              <Editor mark={this.state.mark} change={this.handleChange}/>
            </div>
            <div className="cont">
             <h2>Preview</h2>
             <Preview preview={this.state.preview} />
            </div>
          </div>
      </div>
    )
  }

}
const Editor = (props) => {
  return(<textarea
    autoFocus
    id="editor"
    value = {props.mark}
    placeholder = "Write some markdown here"
    onChange = {props.change}
  />)
}
const Preview = (props) => {
  return (
    <div id="preview" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(props.preview)}} />
  )
}