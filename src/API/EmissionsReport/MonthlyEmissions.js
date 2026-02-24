import { appsettings } from "../../settings/appsettings";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function getMonthlyEmissions(year) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsReport/MonthlyEmissions?year=${year}`,
    {
      method: "GET",
      credentials: "include",
    }
  ); //7217 puerto

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

export async function getSourcesEmissions(year) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsReport/SourcesEmissions?year=${year}`,
    {
      method: "GET",
      credentials: "include",
    }
  ); //7217 puerto

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

export async function getRangeByMonthsEmissions(
  year,
  initialMonth,
  finalMonth
) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsReport/RangeByMonth?year=${year}&initialMonth=${initialMonth}&finalMonth=${finalMonth}`,
    {
      method: "GET",
      credentials: "include",
    }
  ); //7217 puerto

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

export async function getRangeByYearsEmissions(initialYear, finalYear) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsReport/RangeByYears?initialYear=${initialYear}&FinalYear=${finalYear}`,
    {
      method: "GET",
      credentials: "include",
    }
  ); //7217 puerto

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}
