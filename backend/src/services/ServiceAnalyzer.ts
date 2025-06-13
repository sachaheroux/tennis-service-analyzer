export interface ServiceResult {
  isIn: boolean;
  zone: string;
  coordinates: {
    x: number;
    y: number;
  };
  accuracy: number;
  timestamp: string;
}

export interface ServiceStats {
  totalServices: number;
  successfulServices: number;
  successRate: number;
  zoneDistribution: {
    [key: string]: number;
  };
  averageAccuracy: number;
}

export class ServiceAnalyzer {
  private services: ServiceResult[] = [];

  analyzeService(x: number, y: number, courtWidth: number, courtHeight: number): ServiceResult {
    // Calcul des zones de service (proportions du terrain)
    const serviceBoxLeft = courtWidth * 0.5;
    const serviceBoxRight = courtWidth * 0.85;
    const serviceBoxTop = courtHeight * 0.25;
    const serviceBoxBottom = courtHeight * 0.75;

    const isInServiceBox = 
      x >= serviceBoxLeft && 
      x <= serviceBoxRight && 
      y >= serviceBoxTop && 
      y <= serviceBoxBottom;

    let zone = 'Hors service';
    let accuracy = 0;

    if (isInServiceBox) {
      const centerY = courtHeight * 0.5;
      
      if (y < centerY) {
        zone = 'Service T (haut)';
        // Calcul de la précision pour le service T
        const distanceFromT = Math.abs(y - serviceBoxTop) / (centerY - serviceBoxTop);
        accuracy = Math.max(0, 100 - (distanceFromT * 50));
      } else {
        zone = 'Service large (bas)';
        // Calcul de la précision pour le service large
        const distanceFromCorner = Math.abs(y - serviceBoxBottom) / (serviceBoxBottom - centerY);
        accuracy = Math.max(0, 100 - (distanceFromCorner * 30));
      }

      // Ajustement de la précision selon la distance horizontale
      const horizontalCenter = (serviceBoxLeft + serviceBoxRight) / 2;
      const horizontalDistance = Math.abs(x - horizontalCenter) / (serviceBoxRight - serviceBoxLeft);
      accuracy = Math.max(0, accuracy - (horizontalDistance * 20));
    }

    const result: ServiceResult = {
      isIn: isInServiceBox,
      zone,
      coordinates: { x, y },
      accuracy: Math.round(accuracy),
      timestamp: new Date().toISOString()
    };

    // Enregistrer le service pour les statistiques
    this.services.push(result);

    return result;
  }

  getStats(): ServiceStats {
    const totalServices = this.services.length;
    const successfulServices = this.services.filter(s => s.isIn).length;
    const successRate = totalServices > 0 ? (successfulServices / totalServices) * 100 : 0;

    // Distribution par zone
    const zoneDistribution: { [key: string]: number } = {};
    this.services.forEach(service => {
      zoneDistribution[service.zone] = (zoneDistribution[service.zone] || 0) + 1;
    });

    // Précision moyenne
    const totalAccuracy = this.services.reduce((sum, service) => sum + service.accuracy, 0);
    const averageAccuracy = totalServices > 0 ? totalAccuracy / totalServices : 0;

    return {
      totalServices,
      successfulServices,
      successRate: Math.round(successRate * 100) / 100,
      zoneDistribution,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100
    };
  }

  resetStats(): void {
    this.services = [];
  }

  getRecentServices(limit: number = 10): ServiceResult[] {
    return this.services.slice(-limit);
  }
} 