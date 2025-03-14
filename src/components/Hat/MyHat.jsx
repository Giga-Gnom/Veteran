import React, { useState } from "react";
import DropDownButton from "../UI/MyButtons/DropDownButton";
import styles from "./MyHat.module.css"
import lentochka from "./srcHat/lentochka.png"
import DropList from "../DropList/DropList";

const MyHat = (props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        console.log("ok")
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest('.dropListContainer')) {
            setIsDropdownOpen(false);
        }
    };
    
    return(
        <div>
            <div className={styles.haedContainer}>
                <img className={styles.images} src={lentochka}></img>
                <h1 className={styles.header__text}>{props.heading}</h1>
                <DropDownButton onClick={handleToggleDropdown}></DropDownButton>
                {isDropdownOpen && (                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                    onClick={handleOutsideClick}>
                        <div style={{
                            zIndex: 1001,
                            background: 'black',
                            width: '25vw',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <DropList />
                        </div>
                    </div>)}
            </div>
        </div>
    )
}

export default MyHat;