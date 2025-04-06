const calculateSecurityScore = () => {
    if (!shodanData) return "N/A";
    const vulnerabilities = shodanData.vulns?.length || 0;
    const ports = shodanData.ports?.length || 0;
    return Math.max(0, 100 - vulnerabilities * 10 - ports * 2); // Example formula
  };
302
{calculateSecurityScore()}



414
{renderVisualization()}