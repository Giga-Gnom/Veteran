import { useEffect, useState } from "react";
import styles from "./AdminMapWindow.module.css"
import mapService from "../../../services/mapService";
import { districtsAdminArray } from "./districtsAdminArray";

const AdminMapWindow = () => {
    const [loading, setLoading] = useState(false)
    const [organizations, setOrganizations] = useState([])
    const [currentDistrict, setCurrentDistrict] = useState(null)
    const [currentArea, setCurrentArea] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [organization, setOrganization] = useState({
        head_text: "",
        is_head: false,
        director: "",
        phone: "",
        address: ""
    })
    const [mainOrg, setMainOrg] = useState(null)
    const [showError, setShowError] = useState(false)

    useEffect(()=>{
        if (currentArea)
            loadOrganizationsForArea(currentDistrict.name, currentArea.id)
    },[currentDistrict, currentArea])

    const loadOrganizationsForArea = async (districtName, areaId) => {
        try{
            setLoading(true)
            const organizationsData = await mapService.getAllOrganizationsFromArea(districtName, areaId)
            setOrganizations(organizationsData)

            const haveMain = organizationsData.find(org => org.is_head === 1)
            if (haveMain){
                setMainOrg(haveMain)
            }
        } catch (error) {
            console.error("error loading organizations", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDistrictClick = (district) => {
        setCurrentDistrict(district)
    }

    const handleAreaClick = (area) => {
        setMainOrg(null)
        setCurrentArea(area)
    }

    const handleOpenForm = (isHead) => {
        setOrganization(prev => ({
            ...prev,
            is_head: isHead ? 1 : 0
        }))
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
    }

    const saveOrganization = async (districtName, areaId) => {
        try{
            const orgData = {
                ...organization,
                district_name: districtName,
                area_num: areaId
            }
            await mapService.insertOrganization(orgData)
            setOrganization({
                head_text: "",
                is_head: false,
                director: "",
                phone: "",
                address: ""
            })
            loadOrganizationsForArea(districtName, areaId)
            setIsFormOpen(false)
        } catch (error) {
            console.error("error insert organization data: ", error)
        }
    }

    const deleteOrganization = async (org) => {
        try{
            await mapService.deleteOrganization(org.id)
            loadOrganizationsForArea(org.district_name, org.area_num)
        } catch (error) {
            console.error("error deleting organization", error)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setOrganization(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCloseArea = () => {
        if(currentArea){
            setCurrentArea(null)
            setMainOrg(null)
            return
        }
        setCurrentDistrict(null)
        setMainOrg(null)
    }

    if (loading) {
        return(
            <div>loading</div>
        )
    }

    const handleShowError = () => {
        setShowError(true)
    }

    const handleCloseError = () => {
        setShowError(false)
    }


    return(
        <div className={styles.container}>
            {showError && (
            <div className={styles.error_fon} onClick={handleCloseError}>
                <div className={styles.error_block} onClick={(e) => e.stopPropagation()}>
                    главная организация уже добавлена
                    <div className={styles.close_error} onClick={handleCloseError}>
                        x
                    </div>
                </div>
            </div>
            )}
            <div className={styles.container_areaChanges}>
                <div className={styles.container_areaChanges_slider}>
                    {!currentDistrict && (
                        <div className={styles.areas_container}>
                            {districtsAdminArray.map((district, i) => (
                                <div key={i} onClick={() => handleDistrictClick(district)} className={styles.area_card}>
                                    {district.name}
                                </div>
                            ))}
                        </div>
                    )}
                    {(currentDistrict) && (
                        <div className={styles.areas_container}>
                            {districtsAdminArray.find(district => district.name === currentDistrict.name).area.map((area, i) => (
                                <div key={i} onClick={()=>handleAreaClick(area)} className={`${styles.area_card} ${currentArea?.name === area.name ? styles.active_card : ''}`}>
                                    {area.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {(currentDistrict) && (
                    <div className={styles.return_btn_block_1}>
                        <div onClick={handleCloseArea} className={styles.return_btn_block}>
                            <div className={styles.return_btn_fon}>
                            </div>
                        </div>
                        {!currentArea && currentDistrict && (
                            <div className={styles.transparent_bloc}>
                            </div>
                        )}
                    </div>
                )}
                {currentArea && (
                    <div className={styles.container_areaChanges_buttons}>
                        <button onClick={() => handleOpenForm(false)} className={styles.add_btn}>
                            Добавить организацию
                        </button>
                        <button onClick={mainOrg ? () => handleShowError() : () => handleOpenForm(true)} className={styles.add_btn}>
                            Добавить главную организацию
                        </button>
                    </div>
                )}
            </div>

            {(!currentArea || !currentDistrict) ? (
                <div className={styles.empty_orgs}>"выбери район"</div>
            ) : (
                <div className={styles.container_organizations}>
                    {organizations.map((org, i) => (
                        <div key={i} className={styles.organization_card}>
                            <div className={styles.organization_card_header}>
                                {org.is_head ? ("Главная " + org.head_text) : ("ПО номер " + org.head_text)}
                            </div>
                            <div className={styles.x_scroll}>
                                {org.address}
                            </div>
                            <div>
                                {org.director}
                            </div>
                            <div>
                                {org.phone}
                            </div>
                            <button onClick={() => deleteOrganization(org)}>
                                Удалить
                            </button>
                        </div>
                    ))}
                </div> 
            )}

            {isFormOpen && (
                <div className={styles.form_fon} onClick={handleCloseForm}>
                    <div className={styles.form} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.input_title}>
                            {organization.is_head ? (<span>Название района</span>) : (<span>Номер первичной организации</span>)}
                        </div>
                        {!organization.is_head ? (
                            <input className={styles.form_input} type="number" name="head_text" value={organization.head_text} onChange={handleInputChange} placeholder="1"/>
                        ) : (
                            <input className={styles.form_input} type="text" name="head_text" value={organization.head_text} onChange={handleInputChange} placeholder="дегунино"/>
                        )} 
                        <div className={styles.input_title}>
                            Адрес
                        </div>
                        <input className={styles.form_input} type="text" name="address" value={organization.address} onChange={handleInputChange} placeholder="ул. д."/>
                        <div className={styles.input_title}>
                            ФИО председателя организации
                        </div>
                        <input className={styles.form_input} type="text" name="director" value={organization.director} onChange={handleInputChange} placeholder="ФИО"/>
                        <div className={styles.input_title}>
                            Номер телефона первичной организации
                        </div>
                        <input className={styles.form_input} type="tel" name="phone" value={organization.phone} onChange={handleInputChange} placeholder="8 ххх ххх хх хх"/>
                        <div className={styles.save_btn_block}>
                            <button className={styles.save_btn} onClick={() => saveOrganization(currentDistrict.name, currentArea.id)}>
                                Сохранить
                            </button>
                        </div>
                        <div onClick={handleCloseForm} className={styles.close_x}>
                            x
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMapWindow;