"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
/*
data = [
    {
        "name": "Correct",
        "value": 50
    },
    {
        "name": "Incorrect",
        "value": 50
    }
]
*/
export default function JPie(correct, total) {

    const data = [
        {
            name: "Correct",
            value: correct
        },
        {
            name: "Incorrect",
            value: total - correct
        }
    ]

    //console.log(data);

    const colors = ["#00FF00", "#FF0000"];

    return (
        <PieChart width={730} height={250} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Tooltip />
            <Legend align="left" verticalAlign="bottom" height={36}/>
            <Pie data={data} startAngle={180}
          endAngle={0} cx={100} innerRadius={80} outerRadius={100} paddingAngle={4} >
                {
                    data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} strokeWidth={0}/>
                    ))
                }
            </Pie>
        </PieChart>
    )
}