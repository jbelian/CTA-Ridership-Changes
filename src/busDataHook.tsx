import React from "react";
import busData from "./bus.json";

export interface RouteData {
  route: string;
  routename: string;
  month_beginning: string;
  monthtotal: string;
}

export interface ExtendedRouteData extends RouteData {
  monthtotal2: string;
  percentChange: string;
}

export const useBusData = (
  selectedDate1: string,
  selectedDate2: string
): ExtendedRouteData[] => {
  const busDataArray: RouteData[] = busData as RouteData[];

  const returnSelectedDate = (date: string) => {
    return busDataArray.filter((item) => {
      return date === item.month_beginning.substring(0, 7);
    });
  };

  const filteredData1 = returnSelectedDate(selectedDate1);
  const filteredData2 = returnSelectedDate(selectedDate2);

  const combinedFilteredData: ExtendedRouteData[] = [];

  filteredData1.forEach((item1) => {
    const matchingItem2 = filteredData2.find(
      (item2) => item2.route === item1.route
    );

    const i = item1.monthtotal;
    const j = matchingItem2 ? matchingItem2.monthtotal : "";
    const x = parseFloat(i);
    const y = parseFloat(j);

    combinedFilteredData.push({
      route: item1.route,
      routename: item1.routename,
      month_beginning: item1.month_beginning,
      monthtotal: i,
      monthtotal2: j,
      percentChange: matchingItem2
        ? (((y - x) / Math.abs(x)) * 100).toFixed(1)
        : "",
    });
  });

  filteredData2.forEach((item2) => {
    const matchingItem1 = filteredData1.find(
      (item1) => item1.route === item2.route
    );
    if (!matchingItem1) {
      combinedFilteredData.push({
        route: item2.route,
        routename: item2.routename,
        month_beginning: item2.month_beginning,
        monthtotal: "",
        monthtotal2: item2.monthtotal,
        percentChange: "",
      });
    }
  });

  return combinedFilteredData;
};

export const BusDataTable: React.FC<{
  combinedFilteredData: ExtendedRouteData[];
  selectedDate1: string;
  selectedDate2: string;
}> = ({ combinedFilteredData, selectedDate1, selectedDate2 }) => {
  const getYearAndMonthName = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    const year = date.getFullYear();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    return `${monthName} ${year}`;
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Route Name</th>
          {/* <th>Month Beginning</th> */}
          <th>{getYearAndMonthName(selectedDate1)}</th>
          <th>{getYearAndMonthName(selectedDate2)}</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        {combinedFilteredData.map((item: ExtendedRouteData, index: number) => (
          <tr key={index}>
            <td>{item.route}</td>
            <td>{item.routename}</td>
            {/* <td>{item.month_beginning}</td> */}
            <td>{item.monthtotal}</td>
            <td>{item.monthtotal2}</td>
            <td>{item.percentChange}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
