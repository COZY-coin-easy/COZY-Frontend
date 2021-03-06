import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import "./chartStyle.css";
import { candleStickRequest } from "../../features/candleStick/candleStickSlice";

export default function Chart() {
  const dispatch = useDispatch();
  const chartData = useSelector((state) => state.candleStick.candleStick);
  const [time, setTime] = useState("10m");
  const { currencyName } = useParams();

  useEffect(() => {
    let setTimeoutID = null;
    const fetchData = function () {
      setTimeoutID = setTimeout(() => {
        dispatch(candleStickRequest({ currencyName, time }));

        fetchData();
      }, 1000);
    };

    fetchData();

    return () => {
      clearTimeout(setTimeoutID);
    };
  }, [currencyName, dispatch, time]);

  const ohlc = [];
  const volume = [];
  const groupingUnits = [
    ["minute", [5, 10, 30, 60]],
    ["hour", [1, 2, 4, 6, 12, 24]],
    ["day", [1]],
    ["week", [1]],
    ["month", [1, 2, 3, 6]],
  ];

  for (let i = 0; i < chartData.length; i++) {
    ohlc.push([
      chartData[i][0] + 32400000,
      Number(chartData[i][1]),
      Number(chartData[i][2]),
      Number(chartData[i][3]),
      Number(chartData[i][4]),
    ]);
    volume.push([chartData[i][0] + 32400000, Number(chartData[i][5])]);
  }

  const options = {
    rangeSelector: {
      buttons: [
        {
          type: "hour",
          count: 1,
          text: "1시간",
        },
        {
          type: "day",
          count: 1,
          text: "1일",
        },
        {
          type: "day",
          count: 7,
          text: "7일",
        },
        {
          type: "month",
          count: 1,
          text: "1달",
        },
        {
          type: "year",
          count: 1,
          text: "1년",
        },
        {
          type: "all",
          text: "All",
        },
      ],
    },
    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: currencyName,
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "거래량",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
      },
    ],
    tooltip: {
      split: true,
    },
    plotOptions: {
      series: {
        dataGrouping: {
          units: groupingUnits,
        },
      },
    },
    title: {
      text: currencyName,
    },
    series: [
      {
        type: "candlestick",
        name: "Bitcoin",
        id: "coin",
        zIndex: 2,
        data: ohlc,
      },
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
      },
    ],
    chart: {
      animation: false,
      styledMode: true,
    },
  };

  const handleChangePeriod = (e) => {
    if (e.target.value === "1일") setTime("1m");
    if (e.target.value === "3일") setTime("3m");
    if (e.target.value === "10일") setTime("5m");
    if (e.target.value === "20일") setTime("10m");
    if (e.target.value === "2달") setTime("30m");
    if (e.target.value === "6달") setTime("1h");
    if (e.target.value === "3년") setTime("6h");
    if (e.target.value === "8년") setTime("24h");
  };

  return (
    <ChartWrapper>
      <div className="date-selector">
        원하는 기간을 선택해주세요
        <select onChange={handleChangePeriod}>
          <option>1일</option>
          <option>3일</option>
          <option>10일</option>
          <option>20일</option>
          <option>2달</option>
          <option>6달</option>
          <option>3년</option>
          <option>8년</option>
        </select>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </div>
    </ChartWrapper>
  );
}

const ChartWrapper = styled.div`
  width: 100vh;
  height: 100vh;

  .date-selector {
    margin: 160px 0px 50px 0px;
  }
`;
