import React, { useEffect, useRef, useState } from "react";
import styles from "./StructWindow.module.css"
import MyHat from "../../Hat/MyHat";
import BottomPanel from "../../BottomPanel/BottomPanel";
import { headsArray } from "./blocks/HeadBlock/headsArray";
import HeadBlock from "./blocks/HeadBlock/HeadBlock";
import { topContentArray } from "./blocks/ContentBlock/topContentArray";
import ContentBlock from "./blocks/ContentBlock/ContentBlock";
import { otdelContentArray } from "./blocks/ContentBlock/otdelContentArray";
import { pokContentArray } from "./blocks/ContentBlock/pokContentArray";
import { voaoContentArray } from "./blocks/ContentBlock/voaoContentArray";
import { mgovContentArray } from "./blocks/ContentBlock/mgovContentArray";
import newspaper from "./srcStruct/newspaper.png"
import { useLocation } from "react-router-dom";


const StructWindow = () => {
    const location = useLocation();
    const contentRef = useRef(null)
    const isInitialLoad = useRef(true)

    useEffect(() => {

        const contentElement = contentRef.current

        if (!contentElement) return

        const fromDepartment = location.state?.fromDepartment === true || sessionStorage.getItem("fromDepartment") === "true";

        if (isInitialLoad.current){
            const savedPos = sessionStorage.getItem("structScrollPos")
            if (savedPos && fromDepartment) {
                    contentElement.scrollTop = parseInt(savedPos, 10)
            }
            else {
                contentElement.scrollTop = 0
                sessionStorage.setItem("structScrollPos", "0")
            }
            sessionStorage.setItem("fromDepartment", "false")
            isInitialLoad.current = false

        }

        const handleScroll = () => {
            const scrollPosition = contentElement.scrollTop
            sessionStorage.setItem("structScrollPos", scrollPosition.toString())
        }

        contentElement.addEventListener('scroll', handleScroll)

        return () => {
            contentElement.removeEventListener('scroll', handleScroll)
        }
    }, [location.state]);

    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="структура Московской городской организации ветеранов" />
            </div>
            <div 
            className={styles.container_content} 
            ref={contentRef}
            >
                <div className={styles.container_content_newtop}>
                    <div className={styles.container_content_top}>
                        {topContentArray.map((topContent, index) => <ContentBlock className={styles.container_content_top_block} key={index} content={topContent}></ContentBlock>)}
                    </div>
                </div>
                <div className={styles.container_content_head}>
                    {headsArray.map((head, index) => <HeadBlock key={index} name={head.name}></HeadBlock>)}
                </div>
                <div className={styles.container_content_bot}>
                    <div className={styles.container_content_bot_otdel}>
                        {otdelContentArray.map((otdel, index) => <ContentBlock className={styles.container_content_bot_otdel_block} key={index} content={otdel} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        {pokContentArray.map((pok, index) => <ContentBlock className={styles.container_content_bot_otdel_block} key={index} content={pok} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        {voaoContentArray.map((voao, index) => <ContentBlock className={styles.container_content_bot_otdel_block} key={index} content={voao} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        {mgovContentArray.map((mgov, index) => <ContentBlock className={styles.container_content_bot_otdel_block} key={index} content={mgov} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        <img src={newspaper} style={{padding:"1vh 0"}} alt="" />
                    </div>
                </div>
                <br /><br /><br /><br />
            </div>
            <div className={styles.container_bottom}>
                <BottomPanel />
            </div>
        </div>
    )
}

export default StructWindow;