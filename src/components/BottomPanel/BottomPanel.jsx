import React, { useState } from "react";
import NextPageButton from "../UI/MyButtons/NextPageButton";
import BeforePageButton from "../UI/MyButtons/BeforePageButton";
import ToMainButton from "../UI/MyButtons/ToMainButton";
import styles from "./BottomPanel.module.css"
import { pageIndex } from "../../app/pageIndex";
import { handeleBeforPage, handleNextPage } from "../../app/utils";

const BottomPanel = () =>{
    
    // TODO url после +слеша, по массиву имя, id объекта, на кнопки изменеие id, ищет новый объект и редиректится на 

    return(
        <div>
            <div className={styles.haedContainer}>
                <div className={styles.Buttons}>
                    <BeforePageButton onClick={handeleBeforPage}/>
                </div>
                <div className={styles.Buttons}>
                    <ToMainButton />
                </div>
                <div className={styles.Buttons}>
                    <NextPageButton onClick={handleNextPage}/>
                </div>
            </div>
        </div>
    )
}

export default BottomPanel;