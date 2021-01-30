import { StatusBar } from 'expo-status-bar';
import React,{ useState,useEffect } from 'react';
import { StyleSheet,Text,View,TextInput,Keyboard,TouchableOpacity,Platform} from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import Icon from 'react-native-vector-icons/FontAwesome';

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

import Swipeout from 'react-native-swipeout';
import { Input,Button } from 'react-native-elements';


export default function MyListItem() {
  const [tasks,setTasks]= useState('');
  const [done,setDone]= useState(false);
  const [tasksList,setTasksList]= useState([]);
  const [t,setT]= useState(false);
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage, // for web: window.localStorage
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {}
  });
  
 
  const add = () => {
    setTasksList(tasksList.concat([{key:Math.random(),value:tasks}]));
    setTasks('')
  }
  useEffect(()=>{
    // storage.remove({
    //   key: 'tasks',
    //   id: '1001', 
    // })
    if(t){
    storage.save({
      key: 'tasks',
      id: '1001',
      data: tasksList,
      expires: null
    });
    }
    else{
      setTasks('');
      setT(true);
      storage
      .load({
        key: 'tasks',
        id: '1001'
      })
      .then(ret => {
        // found data goes to then()
        if(ret){
        setTasksList(ret)
        }
      })
      .catch(err => {
        switch (err.name) {
          case 'NotFoundError':
          break;
        case 'ExpiredError':
          break;
      }
    });
    }
  },[tasksList])
  
  const deleteItem = (item)=>{
    const updatedData = tasksList.filter((d) => d !== item);
    setTasksList(updatedData);
  }

  const renderItem = ({ item, index, drag, isActive }) => {
    var swipeoutBtns = [
      {
        text: 'Delete',
        type:'delete',
        backgroundColor:'#e53935',
        onPress:()=> deleteItem(item)
      }
    ]
    return ( 
        <Swipeout right={swipeoutBtns} backgroundColor="white" autoClose>
        <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#ffca28" : item.backgroundColor,
        }}
        onLongPress={drag}
      >
      <View style={[0,1,2].includes(index) ? styles.div : styles.divnp} >
      <Text style={styles.item}>{''}{[0,1,2].includes(index) ? <Icon name="circle" size={Platform.OS === 'ios' ? 16 : 14} color="#ffca28" /> : '  '}
      {'  '}{item.value}</Text>
      </View>
      </TouchableOpacity>
      </Swipeout>
    );
  };
  const input = React.createRef();
  return (
  <>
  <View style={styles.body}>
  {Platform.OS === 'ios' && <TextInput style={styles.input} placeholder=" Enter your task to do" 
      onChangeText={(e)=>{
        if(!done){
        setTasks(e)
        }
      }} 
      value={"kj"}
      value={tasks} 
      onKeyPress={(event) => {
        if(event.nativeEvent.key == 'Enter'){
          setDone(true);
          Keyboard.dismiss()
          if(tasks){
            add();
          }
        }
      }} 
      numberOfLines={1}
      onFocus={()=>{
        setDone(false);
      }}
      multiline={true}>
    </TextInput>}
    {Platform.OS !== 'ios' && 
    <View>
    <Input
    inputStyle={{paddingLeft:5}}
    inputContainerStyle={styles.inputAndroid}
    onChangeText={(e)=>{
      if(!done){
      setTasks(e)
      }
    }} 
    placeholder="Enter your task to do"
    numberOfLines={1}
    onFocus={()=>{
      setDone(false);
    }}
    ref={input}
    ></Input>
    <Button
    title="Add To List"
    onPress={()=>{
      Keyboard.dismiss();
      input.current.clear()
      add()
    }}
    disabled={!tasks}
    buttonStyle={{backgroundColor:'#43a047',width:'95%',alignItems:'center',marginLeft:'2.5%',marginBottom:'2%'}} 
    >
    </Button>
    </View>}

    <View style={styles.container}>
      {tasksList.length === 0 && <Text style={{marginTop:'50%',padding:60}}>You haven't added anything yet to your to do list...</Text>}
      <DraggableFlatList
          data={tasksList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => {setTasksList(data)}}
          activationDistance={20}
        />
      <StatusBar></StatusBar>
    </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
    backgroundColor:'white',
    marginBottom:10
  },
  item:{
    width:'98%',
    color:'red',
    padding:5,
    fontSize:Platform.OS === 'ios' ? 25 : 20,
    borderWidth:1,
    margin:2,
    borderColor:'#b0bec5',
    zIndex:100,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    shadowColor: '#263238',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor:'#fafafa',
    marginBottom:2,
    fontFamily : Platform.OS === 'ios' ? "Times New Roman" : ""
  },
  div:{
    width:'100%',
    textAlign:'left',
    margin:2,
  },
  divnp:{
    width:'100%',
    textAlign:'left',
    margin:2
  },
  body:{
    height:'100%'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderRadius:5,
    backgroundColor:'white',
    borderColor:'#b0bec5',
    fontSize:20,
    marginTop:Platform.OS === 'ios' ? 70 : 50,
    paddingLeft:15,
    shadowColor: '#263238',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inputAndroid: {
    width:'100%',
    fontSize:20,
    marginTop:70,
    marginBottom:'-4%'
  }
});

