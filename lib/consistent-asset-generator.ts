// 일관성 있는 AI 에셋 생성 시스템
export interface GameStyleGuide {
  colorPalette: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  styleRules: {
    lineWeight: number;
    cornerRadius: number;
    shadowStyle: string;
    gradientDirection: string;
  };
  dimensions: {
    iconSize: number;
    gridSize: number;
    aspectRatio: string;
  };
}

// Eco-Quest 게임 스타일 가이드
export const ECO_QUEST_STYLE: GameStyleGuide = {
  colorPalette: {
    primary: ['#2E7D32', '#4CAF50', '#66BB6A'], // 친환경 그린
    secondary: ['#1976D2', '#2196F3', '#42A5F5'], // 클린 블루  
    accent: ['#F57C00', '#FF9800', '#FFB74D']     // 에너지 오렌지
  },
  styleRules: {
    lineWeight: 2,
    cornerRadius: 4,
    shadowStyle: '0 2px 4px rgba(0,0,0,0.1)',
    gradientDirection: '45deg'
  },
  dimensions: {
    iconSize: 64,
    gridSize: 8,
    aspectRatio: '1:1'
  }
};

// 일관성 있는 프롬프트 생성기
export class ConsistentAssetGenerator {
  
  // 스타일 가이드 기반 프롬프트
  static generateConsistentPrompt(
    assetName: string, 
    assetType: 'building' | 'resource' | 'ui',
    style: GameStyleGuide = ECO_QUEST_STYLE
  ): string {
    
    const colorString = [
      ...style.colorPalette.primary,
      ...style.colorPalette.secondary,
      ...style.colorPalette.accent
    ].join(', ');

    const basePrompt = `
Create a ${assetType} icon for "${assetName}" with these EXACT specifications:

STYLE REQUIREMENTS (MUST FOLLOW):
- Color palette ONLY: ${colorString}
- Line weight: ${style.styleRules.lineWeight}px
- Corner radius: ${style.styleRules.cornerRadius}px
- Size: ${style.dimensions.iconSize}x${style.dimensions.iconSize}px
- Aspect ratio: ${style.dimensions.aspectRatio}
- Shadow: ${style.styleRules.shadowStyle}

VISUAL STYLE:
- Isometric 3D perspective
- Clean, minimal design
- Eco-friendly theme
- Game UI suitable
- No text or labels
- Consistent lighting from top-left

OUTPUT FORMAT:
- SVG vector format
- Clean background
- Scalable design
    `.trim();

    return basePrompt;
  }

  // 시리즈 에셋 생성 (일관성 보장)
  static generateSeriesPrompts(assets: string[], type: 'building' | 'resource' | 'ui') {
    const baseStyle = `
CONSISTENT STYLE RULES FOR ALL ICONS:
- Same isometric angle (30 degrees)
- Same lighting direction (top-left)
- Same color palette: ${ECO_QUEST_STYLE.colorPalette.primary.join(', ')}
- Same line weight: ${ECO_QUEST_STYLE.styleRules.lineWeight}px
- Same shadow style: ${ECO_QUEST_STYLE.styleRules.shadowStyle}
- Same size: ${ECO_QUEST_STYLE.dimensions.iconSize}x${ECO_QUEST_STYLE.dimensions.iconSize}px

CREATE A SERIES OF ${assets.length} ICONS WITH IDENTICAL STYLE:
    `;

    return assets.map((asset, index) => `
${baseStyle}

${index + 1}. ${asset}:
${this.generateConsistentPrompt(asset, type)}

---
    `).join('');
  }
}

// 픽셀 아트 변환 시스템
export class PixelArtConverter {
  
  // AI 생성 이미지를 픽셀 아트로 변환하는 프롬프트
  static generatePixelArtPrompt(originalDescription: string): string {
    return `
Convert this to pixel art style:
"${originalDescription}"

PIXEL ART SPECIFICATIONS:
- 32x32 pixel resolution
- Limited color palette (8-16 colors max)
- Clean pixel boundaries
- No anti-aliasing
- Retro game aesthetic
- Each pixel clearly defined
- Use dithering for gradients
- Maintain original concept but in pixel art style

STYLE: 16-bit era game graphics, similar to Super Nintendo games
    `;
  }

  // CSS 픽셀 아트 생성
  static generateCSSPixelArt(assetName: string): string {
    return `
Create a pure CSS pixel art icon for "${assetName}":

REQUIREMENTS:
- Use only CSS (no images)
- Box-shadow technique for pixels
- 32x32 grid
- Eco-Quest color palette
- Pixel-perfect edges
- Scalable with CSS transform

EXAMPLE STRUCTURE:
.pixel-icon {
  width: 32px;
  height: 32px;
  box-shadow: [pixel coordinates and colors];
  transform: scale(2); /* for larger display */
}

OUTPUT: Complete CSS class with all pixel coordinates
    `;
  }
}

// 에셋 품질 검증 시스템
export class AssetQualityChecker {
  
  // 일관성 체크리스트
  static getConsistencyChecklist() {
    return {
      colorPalette: '지정된 색상 팔레트만 사용했는가?',
      style: '동일한 아이소메트릭 각도를 사용했는가?',
      lighting: '조명 방향이 일관되는가?',
      lineWeight: '선 굵기가 통일되어 있는가?',
      size: '아이콘 크기가 정확한가?',
      theme: '에코 친화적 테마에 맞는가?',
      clarity: '32px 크기에서도 명확하게 인식되는가?'
    };
  }

  // 자동 품질 점수 계산
  static calculateQualityScore(asset: {
    usesCorrectColors: boolean;
    hasConsistentStyle: boolean;
    isAppropriateSize: boolean;
    matchesTheme: boolean;
  }): number {
    const weights = {
      usesCorrectColors: 0.3,
      hasConsistentStyle: 0.3,
      isAppropriateSize: 0.2,
      matchesTheme: 0.2
    };

    let score = 0;
    Object.entries(asset).forEach(([key, value]) => {
      if (value && weights[key as keyof typeof weights]) {
        score += weights[key as keyof typeof weights];
      }
    });

    return Math.round(score * 100);
  }
}

// 사용 예시
export const generateEcoQuestAssets = () => {
  const facilities = [
    '연구소', '태양광 발전소', '풍력 발전소', 
    '주거 단지', '상업 지구', '공원', '재활용 센터'
  ];

  console.log("=== 일관성 있는 시설 아이콘 생성 프롬프트 ===");
  console.log(ConsistentAssetGenerator.generateSeriesPrompts(facilities, 'building'));
};
