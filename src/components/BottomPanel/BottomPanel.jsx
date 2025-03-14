import React, { useState } from "react";
import NextPageButton from "../UI/MyButtons/NextPageButton";
import BeforePageButton from "../UI/MyButtons/BeforePageButton";
import ToMainButton from "../UI/MyButtons/ToMainButton";
import styles from "./BottomPanel.module.css"
import { pageIndex } from "../../app/pageIndex";

const BottomPanel = () =>{
    const [currentIndex, setCurrentIndex] = useState(8);
    // TODO url после +слеша, по массиву имя, id объекта, на кнопки изменеие id, ищет новый объект и редиректится на 
    function getLastUrl() {
        const currentUrl = window.location.pathname;
        const segment = currentUrl.split('/')
        return segment.length>0 ? '/'+segment.pop() : 'фывап';
    }

    function getCurrentUrlIndex(){
        const currentUrl = getLastUrl();
        return pageIndex.findIndex(item => item.route===currentUrl);
    }

    function handeleBeforPage(){
        console.log("asdfg");
        const currentIndex = getCurrentUrlIndex();
        const beforePage = pageIndex[currentIndex-1];
        window.location.href=beforePage.route;
    }

    console.log(getCurrentUrlIndex());

    return(
        <div>
            <div className={styles.haedContainer}>
                <div className={styles.Buttons}>
                    <BeforePageButton/>
                </div>
                <div className={styles.Buttons}>
                    <ToMainButton />
                </div>
                <div className={styles.Buttons}>
                    <NextPageButton />
                </div>
            </div>
        </div>
    )
}

export default BottomPanel;