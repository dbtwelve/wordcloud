import Post from "components/Post";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid"   //create random id

//export default () => <span>Home</span>;
const Home = ({userObj}) => {
    const [upload, setUpload] =  useState("");
    const [postlist, setPostList] =  useState([]);
    const [attachment, setAttachment] = useState("");
    /*
    const getPostList = async() => {
        const dbPosts = await dbService.collection("posts").get();
        dbPosts.forEach((document) => {
            const postObject = {
                ...document.data(),
                id: document.id,
            }
            //console.log(postObject)
            setPostList(prev => [postObject, ...prev]);
        })
        
    }*/
    useEffect(() => {
        //getPostList();
        //실시간으로 화면에 나타내기 위해 snapshot 사용
        dbService.collection("posts").onSnapshot(snapshot => {
            const postArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(),
            }));
            setPostList(postArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentURL = "";
        if(attachmentURL !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentURL = await response.ref.getDownloadURL();
        }
        const post = {
            text : upload,
            createdAt : Date.now(),
            creatorId : userObj.uid,
            attachmentURL
        }
        await dbService.collection("posts").add(post);
        setUpload("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setUpload(value);
    };
    const onFileChange = (event) => {
        const {
            target: {files},
        }   =   event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => {
        setAttachment(null);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={upload} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Upload" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                    
                )}
            </form>
            <div>
                {postlist.map((list) => (
                    <Post key={list.id} postObj={list} isOwner={list.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;