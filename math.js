// This file contains the logic for mathematical statistics related to historical index analysis

// Descriptive statistics functions
function calculateMean(values) {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

function calculateMax(values) {
    if (values.length === 0) return 0;
    else 
    return Math.max(...values);
}

function calculateMin(values) {
    if (values.length === 0) return 0;
    else return Math.min(...values);
}

function calculateRange(values) {
    if (values.length === 0) return 0;
    else return Math.max(...values) - Math.min(...values);
}

function calculateMedian(values) {
    if (values.length === 0) return 0;
    
    // Create a copy and sort numerically (handles negative numbers)
    const sorted = [...values].sort((a, b) => a - b);
    const length = sorted.length;
    
    // For odd length, return middle element
    if (length % 2 === 1) {
        return sorted[Math.floor(length / 2)];
    }
    
    // For even length, return average of two middle elements
    const middle1 = sorted[length / 2 - 1];
    const middle2 = sorted[length / 2];
    return (middle1 + middle2) / 2;
}


function calculateStandardDeviation(values) {
    if (values.length < 2) return 0; // Need at least 2 values for sample SD
    const mean = calculateMean(values);
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / (values.length - 1); // Sample variance
    return Math.sqrt(variance);
}

function calculateCoefficientOfVariation(values) {
    if (values.length < 2) return 0;
    const mean = calculateMean(values);
    
    // Handle division by zero or very small mean
    if (Math.abs(mean) < 1e-10) return 0;
    
    const stdDev = calculateStandardDeviation(values);
    return (stdDev / Math.abs(mean)) * 100; // Return as percentage
}

function calculateSkewness(values) {
    if (values.length < 3) return 0; // Need at least 3 values
    const n = values.length;
    const mean = calculateMean(values);
    const stdDev = calculateStandardDeviation(values);
    
    // Handle case where standard deviation is 0
    if (stdDev < 1e-10) return 0;
    
    const cubedDeviations = values.map(val => Math.pow((val - mean) / stdDev, 3));
    return cubedDeviations.reduce((acc, val) => acc + val, 0) / n;
}

function calculateKurtosis(values) {
    if (values.length < 4) return 0; // Need at least 4 values
    const n = values.length;
    const mean = calculateMean(values);
    const stdDev = calculateStandardDeviation(values);
    
    // Handle case where standard deviation is 0
    if (stdDev < 1e-10) return 0;
    
    const fourthPowersOfDeviations = values.map(val => Math.pow((val - mean) / stdDev, 4));
    return fourthPowersOfDeviations.reduce((acc, val) => acc + val, 0) / n - 3;
}


// Trend analysis functions
function calculateMovingAverage(values, period) {
    if (values.length < period) return [];
    const movingAverages = [];
    for (let i = period - 1; i < values.length; i++) {
        const slice = values.slice(i - period + 1, i + 1);
        movingAverages.push(calculateMean(slice));
    }
    return movingAverages;
}

function linearTrend(values) {
    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += values[i];
        sumXY += i * values[i];
        sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

// Calculate linear trend line points
function calculateTrendLinePoints(values) {
    const { slope, intercept } = linearTrend(values);
    return values.map((_, i) => intercept + slope * i);
}

// Calculate Pearson correlation coefficient
function calculatePearsonCorrelation(values) {
    if (values.length < 2) return 0;
    const n = values.length;
    const mean = calculateMean(values);
    const indexMean = (n - 1) / 2;
    
    let numerator = 0, denominatorX = 0, denominatorY = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = i - indexMean;
        const yDiff = values[i] - mean;
        numerator += xDiff * yDiff;
        denominatorX += xDiff * xDiff;
        denominatorY += yDiff * yDiff;
    }
    
    if (denominatorX * denominatorY === 0) return 0;
    return numerator / Math.sqrt(denominatorX * denominatorY);
}

// Calculate R-squared (coefficient of determination)
function calculateRSquared(values) {
    const correlation = calculatePearsonCorrelation(values);
    return correlation * correlation;
}

// Quantile calculation (Q1, Q3, IQR)
function calculateQuantile(values, q) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = q * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (lower === upper) {
        return sorted[lower];
    }
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function calculateQ1(values) {
    return calculateQuantile(values, 0.25);
}

function calculateQ3(values) {
    return calculateQuantile(values, 0.75);
}

function calculateIQR(values) {
    return calculateQ3(values) - calculateQ1(values);
}

// Calculate z-scores for outlier detection
function calculateZScores(values) {
    const mean = calculateMean(values);
    const stdDev = calculateStandardDeviation(values);
    return values.map(val => (val - mean) / stdDev);
}

// Identify outliers using IQR method (values beyond 1.5 * IQR)
function identifyOutliers(values) {
    const q1 = calculateQ1(values);
    const q3 = calculateQ3(values);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return values.map((val, idx) => ({
        index: idx,
        value: val,
        isOutlier: val < lowerBound || val > upperBound
    }));
}

// Calculate rate of change (percent change from previous value)
function calculateRateOfChange(values) {
    if (values.length < 2) return [];
    const rates = [];
    for (let i = 1; i < values.length; i++) {
        const rate = ((values[i] - values[i-1]) / Math.abs(values[i-1])) * 100;
        rates.push(isFinite(rate) ? rate : 0);
    }
    return rates;
}

// Generate comprehensive statistical summary
function generateDescriptiveStatistics(values, dateLabels = null) {
    if (values.length === 0) return null;
    
    const stdDev = calculateStandardDeviation(values);
    const variance = values.length < 2 ? 0 : Math.pow(stdDev, 2);
    
    return {
        count: values.length,
        mean: calculateMean(values),
        median: calculateMedian(values),
        min: calculateMin(values),
        max: calculateMax(values),
        range: calculateRange(values),
        q1: calculateQ1(values),
        q3: calculateQ3(values),
        iqr: calculateIQR(values),
        stdDev: stdDev,
        variance: variance,
        cv: calculateCoefficientOfVariation(values),
        skewness: calculateSkewness(values),
        kurtosis: calculateKurtosis(values),
        rSquared: calculateRSquared(values),
        trendSlope: linearTrend(values).slope,
        trendIntercept: linearTrend(values).intercept,
        outliers: identifyOutliers(values),
        rateOfChange: calculateRateOfChange(values)
    };
}

// 