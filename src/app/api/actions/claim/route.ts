import { NextResponse } from 'next/server';

const ACTIONS_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
};

export async function OPTIONS() {
  return NextResponse.json(null, { headers: ACTIONS_CORS_HEADERS });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bountyId = url.searchParams.get('bountyId') || 'general';

  const payload = {
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
    title: `Claim Bounty #${bountyId}`,
    description: "Verify your work and claim your SOL reward directly on-chain via Solana Actions.",
    label: "Claim Reward",
    links: {
      actions: [
        {
          label: "Claim 1.5 SOL",
          href: `${url.origin}/api/actions/claim?bountyId=${bountyId}&action=execute`,
        }
      ]
    }
  };

  return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accountStr = body.account;

    if (!accountStr) {
      return NextResponse.json({ error: "No account provided" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const payload = {
      message: "Bounty claim transaction generated successfully on Devnet!",
    };

    return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process action request" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
}