import React, { useState } from "react";
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
import newspaper from "./srcStruct/image.png"


const StructWindow = () => {
    return(
        <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading="Структура МГСВ" />
            </div>
            <div className={styles.container_content}>
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
                        {otdelContentArray.map((otdel, index) => <ContentBlock key={index} content={otdel} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        {pokContentArray.map((pok, index) => <ContentBlock key={index} content={pok} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        {voaoContentArray.map((voao, index) => <ContentBlock key={index} content={voao} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        {mgovContentArray.map((mgov, index) => <ContentBlock key={index} content={mgov} />)}
                    </div>
                    <div className={styles.container_content_bot_otdel}>
                        <img src={newspaper} style={{padding:"1vh 0"}} alt="" />
                    </div>
                </div>
            </div>
            <div className={styles.container_head}>
                <BottomPanel />
            </div>
        </div>
    )
}

export default StructWindow;