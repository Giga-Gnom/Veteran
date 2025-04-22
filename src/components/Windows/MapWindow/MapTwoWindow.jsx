import React from "react";
import styles from "./SocialCommissions.module.css"
import MyHat from "../../../../Hat/MyHat";
import { Link, useParams } from "react-router-dom";
import BeforePageButton from "../../../../UI/MyButtons/BeforePageButton";
import { commissionsArray } from "./commissionsArray";

const MapTwoWindow = () => {
    const {id} = useParams();
    const commission = commissionsArray.find(item => item.id ===Number(id));

    return(
    <div className={styles.container}>
            <div className={styles.container_head}>
                <MyHat heading={commission.title} />
            </div>
            <div className={styles.container_content}>
                {commission.persons.map((person, index) => (
                    <div key={index} className={styles.container_content_person}>
                        <h5 className={styles.container_content_person_h5}>{person.name}</h5>
                        <h5 className={styles.container_content_person_h5}>{person.role}</h5>
                    </div>
                ))}
            </div>
            <div className={styles.container_button}>
                <Link to="/struct">
                    <BeforePageButton/>
                </Link>
            </div>
        </div>
    )
}

export default MapTwoWindow;