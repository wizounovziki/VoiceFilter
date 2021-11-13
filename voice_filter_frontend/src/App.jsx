import React from 'react';
import {HashRouter,Route,Link} from 'react-router-dom'
import { Layout, Menu } from 'antd';
import styles from './css/app.scss'

import HomeContainer from './components/HomeContainer.jsx'
import AboutContainer from './components/AboutContainer.jsx'
import LoginContainer from './components/LoginContainer.jsx'
import RegisterContainer from './components/RegisterContainer.jsx'

const { Header, Content, Footer } = Layout;
export default class App extends React.Component{
    constructor(props){
        super(props)

        this.state={
            login:false,
            user:'Login'
        }
    }

    componentWillMount(){
        var tk = ''
        if (localStorage.getItem("token")) {
            //add token
            this.setState({login:true, user:localStorage.getItem("username")})

            tk = localStorage.getItem("token");
        }
        else{
            this.setState({login:false, user:'login'})
        }
    }

    render(){
       return<HashRouter>            
                <Layout className="layout" style={{height:"100%"}}>

                {/*Header */}
                <Header>
                <div className={styles.logo} />
                
                {console.log('login text change monitor', this.state.user)}
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.hash.split('/')[1]]}>
                    <Menu.Item key="1"><Link to="/home">Home Page</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/about">About Us</Link></Menu.Item>
                    <Menu.Item style = {{"float":"right","margin-left": "auto" }} key="4"><Link to="/login">{this.state.user}</Link> </Menu.Item>
                    <Menu.Item  key="5"><Link to="/register">Register</Link> </Menu.Item>
                    
                </Menu>
                </Header>

                <Content style={{ backgroundColor:'#fff',textAlign: 'center'}}>
                   <Route path="/home" component={HomeContainer}></Route>
                   <Route path="/about" component={AboutContainer}></Route>
                   <Route path="/login" component={LoginContainer}></Route>
                   <Route path="/register" component={RegisterContainer}></Route>
              </Content>
                {/*  */}
                {/* <Footer style={{ textAlign: 'center' }}>Voice Filter ©2021 Created </Footer> */}
            </Layout>
       </HashRouter>
    }
}
