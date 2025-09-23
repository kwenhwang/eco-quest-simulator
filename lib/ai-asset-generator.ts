// AI 기반 에셋 생성 유틸리티
export interface AssetRequest {
  type: 'icon' | 'background' | 'ui-element';
  name: string;
  style: 'pixel' | 'minimal' | 'isometric' | 'flat';
  size: string;
  colors: string[];
  description: string;
}

// AI 프롬프트 생성기
export class AIAssetGenerator {
  
  // DALL-E/Midjourney용 프롬프트 생성
  static generateImagePrompt(request: AssetRequest): string {
    const styleMap = {
      pixel: "pixel art style, 8-bit game aesthetic",
      minimal: "minimal flat design, clean lines",
      isometric: "isometric 3D perspective, game building style", 
      flat: "flat design, modern UI style"
    };

    const colorString = request.colors.length > 0 
      ? `using colors: ${request.colors.join(', ')}` 
      : "using eco-friendly green and blue color palette";

    return `Create a ${request.type} for "${request.name}" in ${styleMap[request.style]}, 
${request.size}, ${colorString}, ${request.description}, 
suitable for eco-friendly city building game UI, clean background, high quality`;
  }

  // Claude/ChatGPT용 SVG 생성 프롬프트
  static generateSVGPrompt(request: AssetRequest): string {
    return `Create an SVG ${request.type} for "${request.name}".
Requirements:
- Style: ${request.style}
- Size: ${request.size} 
- Colors: ${request.colors.join(', ') || 'eco-friendly palette'}
- Description: ${request.description}
- Output: Complete React component with TypeScript
- Make it suitable for eco-friendly city building game
- Include proper viewBox and responsive sizing`;
  }

  // CSS 기반 아이콘 생성 프롬프트
  static generateCSSPrompt(request: AssetRequest): string {
    return `Create a pure CSS ${request.type} for "${request.name}".
Use only CSS properties (no images):
- Style: ${request.style}
- Size: ${request.size}
- Colors: ${request.colors.join(', ') || 'green, blue, yellow'}
- Description: ${request.description}
- Use CSS shapes, gradients, and transforms
- Make it animated if appropriate
- Provide complete CSS class`;
  }
}

// 게임 에셋 요청 템플릿
export const GAME_ASSETS: AssetRequest[] = [
  {
    type: 'icon',
    name: 'Research Lab',
    style: 'isometric',
    size: '64x64px',
    colors: ['#4A90E2', '#2E7D32', '#FFC107'],
    description: 'Scientific research facility with beakers and equipment'
  },
  {
    type: 'icon', 
    name: 'Solar Power Plant',
    style: 'isometric',
    size: '64x64px',
    colors: ['#FBD38D', '#4299E1', '#2D3748'],
    description: 'Solar panels array with sun rays'
  },
  {
    type: 'icon',
    name: 'Wind Power Plant', 
    style: 'isometric',
    size: '64x64px',
    colors: ['#F7FAFC', '#4A5568', '#68D391'],
    description: 'Wind turbine with rotating blades'
  },
  {
    type: 'ui-element',
    name: 'Resource Panel',
    style: 'flat',
    size: '300x80px', 
    colors: ['#2D3748', '#4299E1', '#68D391'],
    description: 'Game UI panel showing money, energy, and population'
  },
  {
    type: 'background',
    name: 'City Grid',
    style: 'minimal',
    size: '1200x800px',
    colors: ['#F7FAFC', '#E2E8F0', '#68D391'],
    description: 'Isometric grid background for city building'
  }
];

// AI 생성 워크플로우
export class AssetWorkflow {
  
  // 1단계: 프롬프트 생성
  static generatePrompts(assetType: 'all' | 'icons' | 'ui' | 'backgrounds' = 'all') {
    const filtered = GAME_ASSETS.filter(asset => {
      if (assetType === 'all') return true;
      if (assetType === 'icons') return asset.type === 'icon';
      if (assetType === 'ui') return asset.type === 'ui-element';
      if (assetType === 'backgrounds') return asset.type === 'background';
      return false;
    });

    return filtered.map(asset => ({
      name: asset.name,
      imagePrompt: AIAssetGenerator.generateImagePrompt(asset),
      svgPrompt: AIAssetGenerator.generateSVGPrompt(asset),
      cssPrompt: AIAssetGenerator.generateCSSPrompt(asset)
    }));
  }

  // 2단계: 배치 생성 스크립트
  static generateBatchScript() {
    const prompts = this.generatePrompts('icons');
    
    return `
# AI 에셋 생성 배치 스크립트
# 각 프롬프트를 AI 도구에 입력하여 에셋 생성

${prompts.map((prompt, index) => `
## ${index + 1}. ${prompt.name}

### DALL-E/Midjourney 프롬프트:
${prompt.imagePrompt}

### Claude/ChatGPT SVG 프롬프트:
${prompt.svgPrompt}

### CSS 프롬프트:
${prompt.cssPrompt}

---
`).join('')}
    `;
  }
}

// 사용 예시
export const generateAllAssets = () => {
  console.log("=== AI 에셋 생성 프롬프트 ===");
  console.log(AssetWorkflow.generateBatchScript());
};
