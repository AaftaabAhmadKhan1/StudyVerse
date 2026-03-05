import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    // Optionally, parse body for custom scale/thread/proxy config
    // const { replicas, threads } = await request.json();
    // You can use these to dynamically update docker-compose or env files

    // Run Docker Compose up in detached mode
    await new Promise((resolve, reject) => {
      exec(
        'docker-compose -f docker-compose.swarm.yml up -d --scale worker=20',
        { cwd: process.cwd() + '/Products/YT Automation' },
        (error, stdout, stderr) => {
          if (error) {
            reject(stderr || error.message);
          } else {
            resolve(stdout);
          }
        }
      );
    });

    return NextResponse.json({ success: true, message: 'Docker bot swarm started.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
