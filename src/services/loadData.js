import * as d3 from 'd3';

let cachedData = null;

export async function loadData() {
    if (!cachedData) {
        cachedData = await d3.csv('/datasource/AsistenciaATM_Dataset.csv');
    }
    return cachedData;
}

export function getServiceComparisonByDepartment(data) {
    const departmentSummary = d3.rollups(
        data,
        group => {
            const total_cp = d3.sum(group, d => +d.CCPP_TOTAL || 0);
            const cp_with_water = d3.sum(group, d => +d.CCPP_SERV || 0);
            const cp_without_water = total_cp - cp_with_water;
            const percentage_with_water = total_cp ? Number(((cp_with_water / total_cp) * 100).toFixed(2)) : 0;

            return {
                name: group[0].DEPARTAMENTO,
                total_cp,
                cp_with_water,
                cp_without_water,
                percentage_with_water
            };
        },
        d => d.DEPARTAMENTO
    );

    return departmentSummary
        .map(([name, values]) => ({ name, ...values }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export function getHierarchicalDataForTreeMap(data) {
    const hierarchyData = d3.rollups(
        data,
        group => ({
            value: d3.sum(group, d => +d.CCPP_TOTAL || 0)
        }),
        d => d.DEPARTAMENTO,
        d => d.PROVINCIA
    );

    return {
        name: 'Peru',
        children: hierarchyData.map(([department, provinces]) => ({
            name: department,
            children: provinces.map(([province, provinceData]) => ({
                name: province,
                value: provinceData.value
            }))
        }))
    };
}

export function renderServiceEvolution(data) {
    const serviceEvolutionData = d3.rollups(
        data,
        group => {
            const total_cp = d3.sum(group, d => +d.CCPP_TOTAL || 0);
            const cp_with_water = d3.sum(group, d => +d.CCPP_SERV || 0);
            const cp_without_water = total_cp - cp_with_water;
            const percentage_with_water = total_cp ? Number(((cp_with_water / total_cp) * 100).toFixed(2)) : 0;

            return {
                total_cp,
                cp_with_water,
                cp_without_water,
                percentage_with_water
            };
        },
        d => d.ANIO
    );

    return serviceEvolutionData
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => a.date - b.date);
}

export function getPoiQualityCorrelation(data) {
    const poiQualityCorrelation = d3.rollups(
        data,
        group => {
            const total_investment = d3.sum(group, d => +d.MONTO_POI || 0);
            const total_micrometers = d3.sum(group, d => +d.CCPP_MICROMED || 0);
            const total_provider_fee = d3.sum(group, d => +d.PRESTADOR_CUOTA || 0);
            const avg_quality_score = (total_micrometers + total_provider_fee) / 2;

            return {
                total_investment,
                total_micrometers,
                total_provider_fee,
                avg_quality_score
            };
        },
        d => d.ANIO
    );

    return poiQualityCorrelation
        .map(([year, values]) => ({ year, ...values }))
        .sort((a, b) => a.year - b.year);
}
