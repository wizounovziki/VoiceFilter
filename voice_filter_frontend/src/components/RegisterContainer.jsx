import React from 'react'
import { Button,Input } from 'antd';
import Axios from 'axios'

export default class RegisterContainer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            login:false,
            userName:"",
            password:"",
            hint:false
        }
    }
    
    nameChange(e){
        this.setState({
            userName:e.target.value
        })
    }

    passwordChange(e){
        this.setState({
            password:e.target.value
        })
    }

    componentWillMount(){
        if (localStorage.getItem("token")) {
            console.log("login ready");
            this.setState({ login: true });
        }
    }

    handleLogin=()=>{
        let formData = new FormData();
        formData.append('user_email', this.state.userName)
        formData.append('user_password', this.state.password)
        const config = {
            headers: { 'content-type': `multipart/form-data` }
          }
        // var link = 'http://e9e7-116-88-178-213.ngrok.io/user/sign_in'
        var link = 'http://127.0.0.1:4397/user/sign_up'
        Axios.post(link, formData, config)
        .then((response) =>{
            var data = response.data
            console.log(data)
            // localStorage.setItem("token",data['token'])
            // localStorage.setItem("username",data['useremail'])
            // data = {'token','usermail','expire_timestamp'}
            this.props.history.push('/login')
        }).catch(err => {
            console.error.bind(err);
            this.setState({hint:true})
    })
    }

    
    render(){
        return(<div style = {{"margin-top": "100"}}>
            <div style={{"text-align":"center"}}>
                <img style = {{"margin-bottom": "10"}} src={require('../img/logo.png')}></img></div>
                <table style={{margin:"0 auto",width:300}}>
                    <tr>
                    <td>User Name:</td>
                    <td><Input onChange={(e)=>this.nameChange(e)} placeholder="Please input your user name" style={{width:200} }/></td>
                    </tr>
                    <tr>
                    <td>Password:</td>
                    <td><Input.Password onChange={(e)=>this.passwordChange(e)} placeholder="Please input your password" style={{width:200}}/></td>
                    </tr>
                    
                </table>
                
                <div style={{"text-align":"center"}}>
                {this.state.hint?<div style={{'color':'red',"text-align":"center"}}>Registration failed.</div>:null}
                <Button type="primary" onClick={this.handleLogin} style={{marginTop:20,width:300}}>Login</Button>
                </div>
                </div>)
    }
}

