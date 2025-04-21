import React, { useState } from "react";
import NextPageButton from "../UI/MyButtons/NextPageButton";
import BeforePageButton from "../UI/MyButtons/BeforePageButton";
import ToMainButton from "../UI/MyButtons/ToMainButton";
import styles from "./BottomPanel.module.css"
import { pageIndex } from "../../app/pageIndex";
import { handeleBeforPage, handelToMainPage, handleNextPage } from "../../app/utils";

import { usePageNavigation } from "../../app/utils";

const BottomPanel = () => {
    const { handelToMainPage, handeleBeforPage, handleNextPage } = usePageNavigation();
    
    return (
        <div className={styles.haedContainer}>
            <div className={styles.Buttons}>
                <BeforePageButton onClick={handeleBeforPage}/>
            </div>
            <div className={styles.Buttons}>
                <ToMainButton onClick={handelToMainPage}/>
            </div>
            <div className={styles.Buttons}>
                <NextPageButton onClick={handleNextPage}/>
            </div>
        </div>
    )
}

export default BottomPanel;