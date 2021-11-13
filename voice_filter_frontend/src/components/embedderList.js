import React, {Component} from 'react'
import AudioPlay from './audioPlay';
import Axios from './axios'
import { Radio, Layout, Menu, Button, Space, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { thisExpression } from '@babel/types';
class EmbedderList extends Component {

    constructor(props){
        super(props)
        this.state = {
            value:-1,
            index:-1,
            nameList:[],
            id:-1,
            name:'',
            src:'',
            embeddedName:'Embedded List'
        }
    }

    componentWillMount(){
        var tk = ''
        if (localStorage.getItem("token")) {

            tk = localStorage.getItem("token");

        }
        
        else{
            console.log('Nooooooooooooooooooooooooooooooooooo')
        }
        const config = {
    
            headers: { 'Access-Control-Allow-Origin': '*','content-type': `multipart/form-data` ,'token': tk }
        }


        var link = 'http://localhost:4397/embedder'


        Axios.get(link, config)
        .then((response) =>{
            var data = response.data
            console.log(data)
            this.setState({nameList:data})         
        })

    }
    
    handleSelect(eName,eId){
        console.log(eName)
        this.setState({embeddedName:eName, id:eId, src:'http://127.0.0.1:4397/embedder_audio/'+ eId})
        // const { id,name} = this.state;
        this.props.callBack(eId,eName);
    }

    render() {
        const {id, src, nameList} = this.state;
        const onClick = ({ key }) =>{
            console.log({key})
        }
        const menu = (
            <Menu nClick={onClick}>
              {this.state.nameList.map(item=>{
                console.log(item.id)
                return<div>
                    <Menu.Item  key={item.id} onClick={() => this.handleSelect(item.name,item.id)} >{item.name}</Menu.Item>
                    </div>
              })}
          
          {/* <Menu>
           <Menu.Item key="1" onClick={() => this.copyClick(text, record)}>复制 
           </Menu.Item>
           <Menu.Item key="2" onClick={() => this.delClick(text, record)}>删除 
           </Menu.Item>
       </Menu> */}

         {/* return menuList.map(item =>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                        {item.title}
                        </Link>
                    </Menu.Item>
                )
            } */}
              {/* <Menu.Item key="1" icon={<UserOutlined />}>
                1st menu item
              </Menu.Item>
              <Menu.Item key="2" icon={<UserOutlined />}>
                2nd menu item
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                3rd menu item
              </Menu.Item> */}
            </Menu>
          );
        if(this.state.nameList.length>0){
        return (
            <div>
                <Space wrap>
                        <Dropdown overlay={menu}>
                        <Button onClick={e => e.preventDefault()}>
                            {this.state.embeddedName} <DownOutlined />
                        </Button>
                        </Dropdown>
                    </Space>
            {this.state.src.length>2? <AudioPlay key = {this.state.id} src = {this.state.src} test = 'Embedder'/> : null}
            </div>
            
        )
    }
    else{
        return (<div></div>)
    }
}
}

export default EmbedderList;