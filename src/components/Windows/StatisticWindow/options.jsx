import { plugins } from "chart.js";

export const options  = {
    responsive: true,
    plugins:{
        legend:{
            position: "bottom",
        },
    },
    title:{
        display: true,
        text: "Статистика ветеранов по округам"
    }
}