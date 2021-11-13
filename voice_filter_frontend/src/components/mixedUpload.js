import React, {Component} from 'react'
import AudioPlay from './audioPlay';
import Axios from './axios'
import { Radio, Layout, Menu, Button, Space } from 'antd';
// import './index.css';
class MixedUpload extends Component {

    constructor(props){
        super(props)
        this.state = {
            play:false,
            id: -1,
            src: ''
        }
    }
    submit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const config = {

            headers: { 'content-type': `multipart/form-data` }
          }

        Axios.post(`/upload/mixed`, formData, config)
        .then((response) =>{
            var data = response.data
            console.log(data)
            if (data['id']>-1){
                this.setState({id:data['id'], src:'http://127.0.0.1:4397/audio/'+data['id']})
                const { id } = this.state;
                this.props.callBack(id);
            }
        })
    };

    render() {
        const {id, src} = this.state;
        if (this.state.id > -1){
        return (
            <div>
                <form onSubmit={this.submit}>
                    <input type="file" name='mixed' accept="audio/*"/>
                    <input type="submit" value="Upload"/>
                </form>
                <div style={{"text-align":"center"}}>
                <AudioPlay
                key = {this.state.id}
                src = {this.state.src}
                test = 'Mixed'
                style={{"text-align":"center"}}
                />
                </div>          
            </div>
        )}
        if (this.state.id == -1){
            return (
                <div>
                    <form onSubmit={this.submit}>
                        <input type="file" name='audio' accept="audio/*"/>
                        <input type="submit" value="Upload"/>
                    </form>            
                </div>
            )
        }

    }
}

export default MixedUpload;